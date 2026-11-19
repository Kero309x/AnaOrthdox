"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AUTH_ERRORS, authPort, DEMO_SCENARIOS, setDemoScenario, type DemoScenario, type DemoSession } from "@/shared/api/authPort";
import { DemoBadge, Panel, Screen, Skeleton } from "@/shared/ui/kit";

const field = "bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink w-full rounded-2xl px-4 py-3 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]";
const btn = "bg-primary w-full rounded-full py-3.5 text-center text-sm font-extrabold text-white transition-transform active:scale-95 disabled:opacity-60";

function Scenarios({ value, onChange, disabled }: { value: DemoScenario; onChange: (s: DemoScenario) => void; disabled?: boolean }) {
  return (
    <Panel>
      <DemoBadge label="وضع تجريبي" />
      <p className="text-ink/65 dark:text-night-ink/65 mt-2 text-right text-[12px] leading-6">مفيش خادم متصل ولا جلسة حقيقية. اختار نتيجة المحاكاة. الرابط لازم يحتوي على ?token=، والقيمة expired بتجرّب الرابط المنتهي.</p>
      <div role="group" aria-label="نتيجة المحاكاة" className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(DEMO_SCENARIOS) as DemoScenario[]).map((s) => (
          <button key={s} type="button" aria-pressed={value === s} disabled={disabled} onClick={() => onChange(s)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${value === s ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{DEMO_SCENARIOS[s]}</button>
        ))}
      </div>
    </Panel>
  );
}

function useScenario() {
  const [scenario, setScenario] = useState<DemoScenario>("ok");
  useEffect(() => setDemoScenario(scenario), [scenario]);
  return [scenario, setScenario] as const;
}

type Phase = "idle" | "busy" | "ok" | "error";

export function VerifyEmail() {
  const token = useSearchParams().get("token") ?? "";
  const [scenario, setScenario] = useScenario();
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState("");
  const lock = useRef(false);
  async function run() {
    if (lock.current) return;
    lock.current = true; setPhase("busy");
    const r = await authPort.verifyEmail({ token });
    lock.current = false;
    if (r.ok) setPhase("ok"); else { setMsg(AUTH_ERRORS[r.code]); setPhase("error"); }
  }
  return (
    <Screen title="تأكيد البريد" backHref="/account">
      <section className="space-y-4 px-6 pt-5" aria-live="polite">
        <Scenarios value={scenario} onChange={setScenario} disabled={phase === "busy"} />
        {!token && <Panel><p role="alert" className="text-primary text-right text-[13px] font-bold">الرابط ناقص: مفيش رمز تأكيد. افتح الرابط من الرسالة كاملاً.</p></Panel>}
        {phase === "busy" && <div aria-busy="true" className="space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-1/2" /></div>}
        {phase === "ok" && <Panel><p role="status" className="text-right text-[14px] font-extrabold">اتحاكى تأكيد البريد. مفيش حساب حقيقي اتأكد.</p></Panel>}
        {phase === "error" && <p role="alert" className="text-primary text-right text-[13px] font-bold">{msg}</p>}
        {phase !== "ok" && token && <button type="button" className={btn} disabled={phase === "busy"} onClick={run}>{phase === "busy" ? "جاري التأكيد…" : phase === "error" ? "جرّب تاني" : "أكّد البريد"}</button>}
        {phase === "error" && <Link href="/account/forgot" className="text-primary block text-center text-[13px] font-bold">اطلب رابط جديد</Link>}
        <Link href="/account/login" className="text-ink/70 dark:text-night-ink/70 block text-center text-[13px] font-bold">رجوع لتسجيل الدخول</Link>
      </section>
    </Screen>
  );
}

export function ResetPassword() {
  const token = useSearchParams().get("token") ?? "";
  const [scenario, setScenario] = useScenario();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const lock = useRef(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    if (pw.length < 8) { setErr("كلمة المرور لازم تكون ٨ حروف على الأقل"); return; }
    if (pw !== confirm) { setErr("كلمتين المرور مش متطابقين"); return; }
    setErr(null); lock.current = true; setPhase("busy");
    const r = await authPort.resetPassword({ token, password: pw });
    lock.current = false;
    if (r.ok) { setPw(""); setConfirm(""); setPhase("ok"); } else { setErr(AUTH_ERRORS[r.code]); setPhase("error"); }
  }
  return (
    <Screen title="كلمة مرور جديدة" backHref="/account/login">
      <section className="space-y-4 px-6 pt-5">
        <Scenarios value={scenario} onChange={setScenario} disabled={phase === "busy"} />
        {!token ? <Panel><p role="alert" className="text-primary text-right text-[13px] font-bold">الرابط ناقص: مفيش رمز استرجاع. اطلب رابط جديد.</p><Link href="/account/forgot" className="text-primary mt-2 block text-[13px] font-bold">اطلب رابط جديد</Link></Panel>
        : phase === "ok" ? <><Panel><p role="status" className="text-right text-[14px] font-extrabold">اتحاكى تغيير كلمة المرور. مفيش حاجة اتحفظت.</p></Panel><Link href="/account/login" className={btn + " block"}>تسجيل الدخول</Link></>
        : (
          <form onSubmit={submit} noValidate aria-busy={phase === "busy"} className="space-y-3">
            <label htmlFor="r-pw" className="block text-right text-[13px] font-bold">كلمة المرور الجديدة</label>
            <input id="r-pw" type="password" dir="ltr" autoComplete="new-password" value={pw} disabled={phase === "busy"} onChange={(e) => setPw(e.target.value)} className={field} />
            <label htmlFor="r-c" className="block text-right text-[13px] font-bold">تأكيد كلمة المرور</label>
            <input id="r-c" type="password" dir="ltr" autoComplete="new-password" value={confirm} disabled={phase === "busy"} onChange={(e) => setConfirm(e.target.value)} className={field} />
            {err && <p role="alert" className="text-primary text-right text-[12px] font-bold">{err}</p>}
            <button type="submit" disabled={phase === "busy"} className={btn}>{phase === "busy" ? "جاري الحفظ…" : phase === "error" ? "جرّب تاني" : "غيّر كلمة المرور"}</button>
          </form>
        )}
      </section>
    </Screen>
  );
}

export function Sessions() {
  const [scenario, setScenario] = useScenario();
  const [sessions, setSessions] = useState<DemoSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  async function load() {
    setSessions(null); setError(null);
    const r = await authPort.listSessions();
    if (r.ok) setSessions(r.sessions); else { setError(AUTH_ERRORS[r.code]); setSessions([]); }
  }
  useEffect(() => { void load() }, []);
  async function revoke(id: string) {
    if (busyId) return;
    setBusyId(id); setNote(null);
    const r = await authPort.revokeSession({ id });
    setBusyId(null);
    if (r.ok) { setSessions((s) => (s ?? []).filter((x) => x.id !== id)); setNote("اتحاكى إنهاء الجلسة."); } else setNote(AUTH_ERRORS[r.code]);
  }
  async function all() {
    if (busyId) return;
    setBusyId("all");
    const r = await authPort.logoutAll();
    setBusyId(null); setConfirmAll(false);
    if (r.ok) { setSessions((s) => (s ?? []).filter((x) => x.isCurrent)); setNote("اتحاكى الخروج من باقي الأجهزة."); } else setNote(AUTH_ERRORS[r.code]);
  }
  return (
    <Screen title="الأجهزة المتصلة" backHref="/account">
      <section className="space-y-4 px-6 pt-5" aria-live="polite">
        <Scenarios value={scenario} onChange={setScenario} disabled={!!busyId} />
        {sessions === null && <div aria-busy="true" className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>}
        {error && <div><p role="alert" className="text-primary text-right text-[13px] font-bold">{error}</p><button type="button" className={btn + " mt-2"} onClick={load}>جرّب تاني</button></div>}
        {sessions && sessions.length === 0 && !error && <p className="text-center text-[13px]">مفيش أجهزة متصلة.</p>}
        {sessions?.map((s) => (
          <Panel key={s.id}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-right"><p className="text-[14px] font-extrabold">{s.device}</p><p className="text-ink/60 dark:text-night-ink/60 text-[12px]">آخر نشاط: {s.lastActive}</p></div>
              {s.isCurrent ? <DemoBadge label="الجهاز ده" /> : <button type="button" disabled={!!busyId} onClick={() => revoke(s.id)} className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full px-4 py-2 text-[12px] font-bold disabled:opacity-60">{busyId === s.id ? "جاري الإنهاء…" : "إنهاء"}</button>}
            </div>
          </Panel>
        ))}
        {note && <p role="status" className="text-right text-[13px] font-bold">{note}</p>}
        {sessions && sessions.some((s) => !s.isCurrent) && (confirmAll
          ? <div className="flex gap-2"><button type="button" className={btn} disabled={!!busyId} onClick={all}>{busyId === "all" ? "جاري التنفيذ…" : "تأكيد الخروج من الباقي"}</button><button type="button" className="bg-rose text-primary-deep rounded-full px-6 text-sm font-bold" onClick={() => setConfirmAll(false)}>تراجع</button></div>
          : <button type="button" className={btn} onClick={() => setConfirmAll(true)}>خروج من باقي الأجهزة</button>)}
      </section>
    </Screen>
  );
}
