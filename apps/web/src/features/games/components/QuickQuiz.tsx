"use client";

import { toArabicNumber } from "@/domain/calendar/coptic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isRecord, useStored } from "@/shared/lib/useStored";
import { Panel, ProgressBar, Screen } from "@/shared/ui/kit";
import { QUESTIONS } from "./Quiz";

const noRec: Record<string, unknown> = {};

/** Week number since a fixed Monday, so every device gets the same weekly set. */
export function weekIndex(date = new Date()): number {
  const base = Date.UTC(2024, 0, 1);
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((now - base) / (7 * 86400000));
}

function seededOrder(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed * 9301 + 49297;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export default function QuickQuiz({ mode }: { mode: "quick" | "weekly" }) {
  const weekly = mode === "weekly";
  const week = weekIndex();
  const count = weekly ? 5 : 10;
  const seconds = weekly ? 25 : 15;
  const [seed, setSeed] = useState(1);
  const order = useMemo(() => seededOrder(QUESTIONS.length, weekly ? week : seed).slice(0, count), [weekly, week, seed, count]);
  const [bests, setBests] = useStored("best.quick", noRec, isRecord);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [left, setLeft] = useState(seconds);
  const finished = i >= order.length;
  const key = weekly ? `weekly-${week}` : "quick";
  const best = typeof bests[key] === "number" ? (bests[key] as number) : null;
  const q = QUESTIONS[order[Math.min(i, order.length - 1)]];

  useEffect(() => {
    if (finished || picked !== null) return;
    if (left <= 0) { setPicked(-1); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, picked, finished]);

  useEffect(() => {
    if (finished && (best === null || score > best)) setBests((p) => ({ ...p, [key]: score }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const answer = (idx: number) => { if (picked !== null) return; setPicked(idx); if (idx === q.answer) setScore((s) => s + 1); };
  const next = () => { setI((x) => x + 1); setPicked(null); setLeft(seconds); };
  const again = () => { setSeed(Math.floor(Math.random() * 100000) + 2); setI(0); setScore(0); setPicked(null); setLeft(seconds); };

  return (
    <Screen title={weekly ? "تحديات أسبوعية" : "أسئلة سريعة"} backHref="/games">
      <section className="space-y-4 px-6 pt-5">
        {finished ? (
          <Panel>
            <p className="text-ink dark:text-night-ink text-center text-2xl font-black">{toArabicNumber(score)} من {toArabicNumber(order.length)}</p>
            <p className="text-ink/60 dark:text-night-ink/60 mt-1 text-center text-[13px]">{best !== null ? `أفضل نتيجة ليك: ${Math.max(best, score)}` : ""}</p>
            <div className="mt-4 flex gap-3">
              {!weekly && <button type="button" onClick={again} className="bg-primary flex-1 rounded-full py-3 text-sm font-bold text-white active:scale-95">العب تاني</button>}
              <Link href="/games" className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink flex-1 rounded-full py-3 text-center text-sm font-bold">الألعاب</Link>
            </div>
            {weekly && <p className="text-ink/55 dark:text-night-ink/55 mt-3 text-center text-[12px]">التحدي بيتغير كل أسبوع.</p>}
          </Panel>
        ) : (
          <>
            <div className="flex items-center justify-between text-[12px] font-bold">
              <span className="text-ink/60 dark:text-night-ink/60">{toArabicNumber(i + 1)} / {toArabicNumber(order.length)}</span>
              <span className={`rounded-full px-3 py-1 ${left <= 5 ? "bg-primary text-white" : "bg-rose-badge text-primary"}`} aria-live="off">{toArabicNumber(left)} ث</span>
            </div>
            <ProgressBar value={(left / seconds) * 100} />
            <Panel>
              <p className="text-ink dark:text-night-ink text-right text-[16px] leading-8 font-extrabold">{q.q}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, idx) => (
                  <button key={opt} type="button" disabled={picked !== null} onClick={() => answer(idx)} className={`w-full rounded-2xl px-4 py-3 text-right text-[14px] font-bold transition-colors ${picked !== null && idx === q.answer ? "bg-primary text-white" : picked === idx ? "bg-gold-soft text-gold-ink" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{opt}</button>
                ))}
              </div>
              {picked !== null && (
                <div className="mt-3 flex items-center justify-between">
                  <p role="status" className="text-ink dark:text-night-ink text-[13px] font-bold">{picked === q.answer ? "صح" : picked === -1 ? "الوقت خلص" : "غلط"}</p>
                  <button type="button" onClick={next} className="bg-primary rounded-full px-6 py-2.5 text-[13px] font-bold text-white active:scale-95">{i === order.length - 1 ? "النتيجة" : "التالي"}</button>
                </div>
              )}
            </Panel>
          </>
        )}
      </section>
    </Screen>
  );
}
