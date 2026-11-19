"use client";

import { useRef, useState } from "react";
import { Card, SectionTitle } from "@/shared/ui/chrome";
import { DemoBadge, Skeleton } from "@/shared/ui/kit";
import { useStored } from "@/shared/lib/useStored";

type Scenario = "ok" | "slow" | "fail";
type Phase = "idle" | "sending" | "done" | "error";

const isScenario = (v: unknown): v is Scenario => v === "ok" || v === "slow" || v === "fail";
const isString = (v: unknown): v is string => typeof v === "string";
const LABELS: Record<Scenario, string> = { ok: "ينجح", slow: "بطيء (٢ ثانية)", fail: "يفشل" };

/**
 * Exercisable server-wait journey. There is NO server: the outcome is chosen by the
 * user, so every state (waiting, success, error with retry) can be inspected honestly.
 */
export function SyncDemo() {
  const [scenario, setScenario] = useStored<Scenario>("demo.syncScenario", "ok", isScenario);
  const [label, setLabel] = useStored<string>("demo.syncLabel", "", isString);
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);

  const submit = async () => {
    if (busy.current) return; // duplicate-submit guard
    busy.current = true;
    setPhase("sending");
    if (scenario === "slow") await new Promise((r) => setTimeout(r, 2000));
    setPhase(scenario === "fail" ? "error" : "done");
    busy.current = false;
  };

  return (
    <section className="px-6">
      <SectionTitle>مزامنة الحساب (محاكاة)</SectionTitle>
      <Card>
        <div className="space-y-3 px-4 py-4 text-right">
          <div className="flex items-center gap-2">
            <DemoBadge label="محاكاة" />
            <p className="text-ink/70 dark:text-night-ink/70 text-[12px] leading-5">مفيش خادم متصل. اختار النتيجة عشان تجرّب كل حالة.</p>
          </div>
          <label className="block text-[12px] font-bold">
            اسم الجهاز (مثلاً: موبايلي)
            <input
              value={label}
              onChange={(e) => { setLabel(e.target.value); if (phase !== "sending") setPhase("idle"); }}
              disabled={phase === "sending"}
              maxLength={40}
              className="border-card-border dark:border-card-border-dark dark:bg-night-chip mt-1 w-full rounded-2xl border bg-white px-3 py-2.5 text-[14px] font-normal"
            />
          </label>
          <div role="group" aria-label="نتيجة المحاكاة" className="flex flex-wrap gap-2">
            {(Object.keys(LABELS) as Scenario[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={scenario === s}
                disabled={phase === "sending"}
                onClick={() => setScenario(s)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold ${scenario === s ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}
              >
                {LABELS[s]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={phase === "sending"}
            className="bg-primary w-full rounded-full py-3 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-60"
          >
            {phase === "sending" ? "جاري الحفظ…" : phase === "error" ? "جرّب تاني" : "احفظ نسخة على الحساب"}
          </button>
          <div aria-live="polite" role="status">
            {phase === "sending" && (
              <div className="space-y-2" aria-busy="true">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            {phase === "done" && <p className="text-[13px] font-bold">تمت المحاكاة بنجاح. مفيش بيانات اتبعتت لأي مكان.</p>}
            {phase === "error" && (
              <p className="text-primary text-[13px] font-bold">فشلت المحاكاة. اسم الجهاز لسه محفوظ، اضغط «جرّب تاني».</p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
