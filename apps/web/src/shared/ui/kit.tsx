"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useStored } from "@/shared/lib/useStored";
import { BottomNav, Header, Toast, useTheme, useToast } from "@/shared/ui/chrome";
import { HeartIcon } from "@/shared/ui/icons";

const ToastContext = createContext<(message: string) => void>(() => {});
export const useShowToast = () => useContext(ToastContext);

/** Standard page frame: header, scroll area, bottom bar and a toast shared by children. */
export function Screen({
  title,
  backHref,
  intro,
  children,
}: {
  title: string;
  backHref?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  useEffect(() => {
    const onFail = () => showToast("مش قادر أحفظ التغيير على الجهاز. راجع إعدادات تخزين المتصفح");
    window.addEventListener("ana:storage-failed", onFail);
    return () => window.removeEventListener("ana:storage-failed", onFail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
        <main className="relative mx-auto min-h-dvh max-w-md pb-32">
          <Header title={title} dark={dark} onToggleTheme={toggleTheme} back={backHref !== undefined} backHref={backHref} />
          {intro && (
            <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">{intro}</p>
          )}
          {children}
          <BottomNav />
          <Toast message={toast} />
        </main>
      </div>
    </ToastContext.Provider>
  );
}

export const cardCls =
  "rounded-3xl border border-card-border bg-white shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none";

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${cardCls} p-4 ${className}`}>{children}</div>;
}

export function Chips<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={value === item.id}
          className={`rounded-full px-4 py-2.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
            value === item.id ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <div className={`${cardCls} p-6 text-center`}>
      <span className="icon-badge icon-badge--pebble bg-gold-soft text-gold-ink mx-auto flex h-12 w-12 items-center justify-center">{icon}</span>
      <p className="text-ink dark:text-night-ink mt-3 text-[15px] font-extrabold">{title}</p>
      {hint && <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-5">{hint}</p>}
      {action && (action.href ? (
        <Link href={action.href} className="bg-primary mt-4 inline-flex rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-transform active:scale-95">
          {action.label}
        </Link>
      ) : (
        <button type="button" onClick={action.onClick} className="bg-primary mt-4 inline-flex rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-transform active:scale-95">
          {action.label}
        </button>
      ))}
    </div>
  );
}

/** Honest label for content that is a design/demo sample, not approved content. */
export function DemoBadge({ label = "عينة تجريبية" }: { label?: string }) {
  return <span className="bg-gold-soft text-gold-ink shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">{label}</span>;
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">{children}</p>;
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <span role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="bg-blush dark:bg-night-chip block h-1.5 w-full overflow-hidden rounded-full">
      <span className="bg-primary block h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </span>
  );
}

export function RoundButton({
  label,
  onClick,
  active,
  children,
  large,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  large?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const size = large ? "h-16 w-16" : "h-12 w-12";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onClick={onClick}
      className={`${size} flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-40 ${
        large ? "bg-primary text-white shadow-lg" : active ? "bg-primary text-white" : "bg-rose-badge text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export function FavButton({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={active ? `إزالة ${label} من المفضلة` : `إضافة ${label} للمفضلة`}
      aria-pressed={active}
      onClick={onToggle}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform active:scale-90 ${
        active ? "bg-primary text-white" : "bg-rose-badge text-primary"
      }`}
    >
      <HeartIcon className="h-4 w-4" />
    </button>
  );
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Share through the system sheet when present, otherwise copy the link. Returns what happened. */
export async function shareOrCopy(title: string, url: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ title, url });
      return "shared";
    }
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-ink/60 dark:text-night-ink/60 px-2 pb-2 text-sm font-extrabold">{children}</h2>;
}

/** Independent on/off filter (for collections such as favorites), separate from the type chips. */
export function ToggleChip({ label, on, onChange }: { label: string; on: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`flex items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
        on ? "border-primary bg-primary text-white" : "border-primary/40 text-primary dark:border-night-ink/30 dark:text-night-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function FilterBar({ children, toggles }: { children: React.ReactNode; toggles: React.ReactNode }) {
  return (
    <section className="space-y-3 px-6 pt-4">
      {children}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="مجموعاتي">{toggles}</div>
    </section>
  );
}

/** Placeholder block for content that is really waiting (route chunk, media metadata). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`bg-blush dark:bg-night-chip motion-safe:animate-pulse block rounded-2xl ${className}`} />;
}

type SourceScenario = "ready" | "slow" | "error" | "empty";
const SOURCE_LABELS: Record<SourceScenario, string> = { ready: "جاهز", slow: "بطيء (٢ ثانية)", error: "خطأ ثم نجاح", empty: "فاضي" };
const isSourceScenario = (v: unknown): v is SourceScenario => v === "ready" || v === "slow" || v === "error" || v === "empty";

/** Scenario chips for demo sources, stored globally under demo.source. */
export function SourceScenarioPicker({ label, onPick }: { label: string; onPick?: () => void }) {
  const [scenario, setScenario] = useStored<SourceScenario>("demo.source", "ready", isSourceScenario);
  return (
    <details className="text-ink/60 dark:text-night-ink/60 text-[11px]">
      <summary className="cursor-pointer text-right font-bold">حالة مصدر {label} (محاكاة، مفيش خادم)</summary>
      <div role="group" aria-label={`حالة مصدر ${label}`} className="flex flex-wrap gap-2 pt-2">
        {(Object.keys(SOURCE_LABELS) as SourceScenario[]).map((s) => (
          <button key={s} type="button" aria-pressed={scenario === s} onClick={() => { setScenario(s); onPick?.(); }} className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${scenario === s ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{SOURCE_LABELS[s]}</button>
        ))}
      </div>
    </details>
  );
}

/**
 * One simulated request, started by the caller (on mount or on submit). Seam for a real fetch.
 * ready/empty resolve at once (no delay); slow waits 2s; error fails the first try, then succeeds.
 */
export function useDemoRequest() {
  const [scenario] = useStored<SourceScenario>("demo.source", "ready", isSourceScenario);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const tries = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const run = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (scenario === "slow") { setStatus("loading"); timer.current = setTimeout(() => setStatus("done"), 2000); return; }
    if (scenario === "error" && tries.current === 0) { tries.current = 1; setStatus("error"); return; }
    tries.current = 0; setStatus("done");
  }, [scenario]);
  const reset = useCallback(() => { tries.current = 0; if (timer.current) clearTimeout(timer.current); setStatus("idle"); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { status, run, reset };
}

/**
 * Exercisable catalog-source states for a list. There is no server: this is the seam where
 * a real list request goes. Default "ready" resolves at once, with no delay. The other
 * scenarios are chosen by the user to see loading, error with retry, and empty.
 * Filters and typed input live outside this wrapper, so they survive every state.
 */
export function DemoSource({ children, label = "القائمة" }: { children: React.ReactNode; label?: string }) {
  const [scenario, setScenario] = useStored<SourceScenario>("demo.source", "ready", isSourceScenario);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"ready" | "loading" | "error">("ready");
  useEffect(() => {
    if (scenario === "slow") {
      setStatus("loading");
      const t = setTimeout(() => setStatus("ready"), 2000);
      return () => clearTimeout(t);
    }
    if (scenario === "error") { setStatus(attempt === 0 ? "error" : "ready"); return; }
    setStatus("ready");
  }, [scenario, attempt]);
  const pick = (s: SourceScenario) => { setAttempt(0); setScenario(s); };
  return (
    <>
      <div className="px-6 pt-3">
        <details className="text-ink/60 dark:text-night-ink/60 text-[11px]">
          <summary className="cursor-pointer text-right font-bold">حالة مصدر {label} (محاكاة، مفيش خادم)</summary>
          <div role="group" aria-label={`حالة مصدر ${label}`} className="flex flex-wrap gap-2 pt-2">
            {(Object.keys(SOURCE_LABELS) as SourceScenario[]).map((s) => (
              <button key={s} type="button" aria-pressed={scenario === s} onClick={() => pick(s)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${scenario === s ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{SOURCE_LABELS[s]}</button>
            ))}
          </div>
        </details>
      </div>
      {status === "loading" && (
        <div role="status" aria-busy="true" aria-label="جاري تحميل القائمة" className="space-y-3 px-6 pt-4">
          <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" />
        </div>
      )}
      {status === "error" && (
        <div className="px-6 pt-4">
          <EmptyState icon={<HeartIcon className="h-6 w-6" />} title="تعذر تحميل القائمة" hint="الفلاتر والبحث لسه زي ما هي. جرّب تاني." action={{ label: "جرّب تاني", onClick: () => setAttempt((n) => n + 1) }} />
        </div>
      )}
      {status === "ready" && scenario === "empty" && (
        <div className="px-6 pt-4"><EmptyState icon={<HeartIcon className="h-6 w-6" />} title={`مفيش ${label} دلوقتي`} hint="المصدر رجّع قائمة فاضية (محاكاة)." /></div>
      )}
      {status === "ready" && scenario !== "empty" && children}
    </>
  );
}
