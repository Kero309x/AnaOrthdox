"use client";

import { useState } from "react";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { Panel, ProgressBar, Screen } from "@/shared/ui/kit";
import { CheckIcon } from "@/shared/ui/icons";

// Clues use only the Coptic month order that the app's calendar already uses.
const WORDS = [
  { clue: "أول شهور السنة القبطية", answer: "توت" },
  { clue: "الشهر اللي بعد توت", answer: "بابه" },
  { clue: "الشهر اللي بعد بابه", answer: "هاتور" },
  { clue: "الشهر اللي بعد هاتور", answer: "كيهك" },
  { clue: "الشهر اللي بعد كيهك", answer: "طوبة" },
  { clue: "الشهر الصغير في آخر السنة", answer: "نسيء" },
];
const none: string[] = [];

export const norm = (s: string) =>
  s.trim().replace(/[\u064B-\u065F\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/\s+/g, "");

export default function Words() {
  const [solved, setSolved] = useStored("words.solved", none, isStringArray);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<string[]>([]);

  const check = (answer: string) => {
    if (norm(vals[answer] ?? "") === norm(answer)) { setSolved((p) => (p.includes(answer) ? p : [...p, answer])); setWrong(null); }
    else setWrong(answer);
  };

  return (
    <Screen title="ألغاز الكلمات" backHref="/games" intro="اكتب الشهر القبطي المناسب لكل تلميح.">
      <section className="space-y-3 px-6 pt-4">
        <ProgressBar value={(solved.length / WORDS.length) * 100} />
        {WORDS.map((w) => {
          const ok = solved.includes(w.answer);
          return (
            <Panel key={w.answer}>
              <p className="text-ink dark:text-night-ink text-right text-[14px] font-extrabold">{w.clue} <span className="text-ink/50 dark:text-night-ink/50 text-[11px]">({norm(w.answer).length} حروف)</span></p>
              {ok ? (
                <p className="bg-primary mt-2 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[15px] font-black text-white"><CheckIcon className="h-4 w-4" />{w.answer}</p>
              ) : (
                <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); check(w.answer); }}>
                  <button type="submit" className="bg-primary rounded-full px-5 text-[13px] font-bold text-white active:scale-95">تأكيد</button>
                  <input aria-label={w.clue} value={vals[w.answer] ?? ""} onChange={(e) => { setVals((p) => ({ ...p, [w.answer]: e.target.value })); setWrong(null); }} aria-invalid={wrong === w.answer} className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink min-w-0 flex-1 rounded-2xl px-3 py-2.5 text-[14px] outline-none" />
                </form>
              )}
              {wrong === w.answer && <p role="alert" className="text-primary mt-1 text-right text-[12px] font-bold">مش دي، جرّب تاني.</p>}
              {!ok && (revealed.includes(w.answer) ? <p className="text-ink/60 dark:text-night-ink/60 mt-1 text-right text-[12px]">الإجابة: {w.answer}</p> : <button type="button" onClick={() => setRevealed((p) => [...p, w.answer])} className="text-primary mt-1 text-[12px] font-bold underline">اظهر الإجابة</button>)}
            </Panel>
          );
        })}
        {solved.length === WORDS.length && <p role="status" className="bg-gold-soft text-gold-ink rounded-3xl p-4 text-center text-[14px] font-extrabold">حليت كل الألغاز</p>}
        {solved.length > 0 && <button type="button" onClick={() => { setSolved([]); setRevealed([]); setVals({}); }} className="text-primary w-full text-center text-[12px] font-bold underline">ابدأ من الأول</button>}
      </section>
    </Screen>
  );
}
