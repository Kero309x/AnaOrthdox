"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localStore } from "@/shared/lib/storage";
import { DemoBadge, Panel, Screen } from "@/shared/ui/kit";
import { AUTH_ERRORS, authPort, DEMO_SCENARIOS, setDemoScenario, type DemoScenario } from "@/shared/api/authPort";

const field = "bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink w-full rounded-2xl px-4 py-3 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--color-primary)]";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Mode = "in" | "up" | "forgot";
const TITLES: Record<Mode, string> = { in: "تسجيل الدخول", up: "إنشاء حساب", forgot: "استرجاع كلمة المرور" };

/**
 * Backend-ready auth journeys (sign in, register, password recovery) against the DEMO
 * adapter in shared/api/authPort. Passwords live only in component state: never stored,
 * logged or transmitted. A successful demo run opens no session.
 */
export default function Login({ mode = "in" }: { mode?: Mode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [scenario, setScenario] = useState<DemoScenario>("ok");
  const lock = useRef(false);
  const [localName, setLocalName] = useState("");
  const [expired, setExpired] = useState(false);
  const [next, setNext] = useState("/account");
  useEffect(() => {
    setLocalName(localStore.getItem("profileName") ?? "");
    const q = new URLSearchParams(window.location.search);
    setExpired(q.get("expired") === "1");
    const n = q.get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) setNext(n);
  }, []);
  useEffect(() => setDemoScenario(scenario), [scenario]);

  function validate() {
    const e: Record<string, string> = {};
    if (mode === "up" && !name.trim()) e.name = "اكتب اسمك";
    if (!email.trim()) e.email = "اكتب البريد الإلكتروني";
    else if (!EMAIL.test(email.trim())) e.email = "البريد مش بصيغة صحيحة، مثال: name@example.com";
    if (mode !== "forgot") {
      if (!password) e.password = "اكتب كلمة المرور";
      else if (mode === "up" && password.length < 8) e.password = "كلمة المرور لازم تكون ٨ حروف على الأقل";
    }
    if (mode === "up" && !e.password && confirm !== password) e.confirm = "كلمتين المرور مش متطابقين";
    return e;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    const e = validate();
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    lock.current = true;
    setBusy(true);
    const em = email.trim();
    const res = mode === "in" ? await authPort.signIn({ email: em, password }) : mode === "up" ? await authPort.register({ name: name.trim(), email: em, password }) : await authPort.requestPasswordReset({ email: em });
    setBusy(false);
    lock.current = false;
    if (res.ok) { setPassword(""); setConfirm(""); setDone(true); } else setFormError(AUTH_ERRORS[res.code]);
  }

  function startLocal() {
    const trimmed = (name || localName).trim().slice(0, 30);
    if (!trimmed) { setErrors({ name: "اكتب اسمك الأول عشان تبدأ بملف محلي" }); return; }
    if (!localStore.setItem("profileName", trimmed)) { setFormError("تعذر حفظ الاسم على الجهاز. راجع إعدادات تخزين المتصفح"); return; }
    router.push("/account");
  }

  const err = (k: string) => (errors[k] ? <p id={`${k}-err`} role="alert" className="text-primary text-right text-[12px] font-bold">{errors[k]}</p> : null);
  const inv = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (done) {
    return (
      <Screen title={TITLES[mode]} backHref="/account">
        <section className="space-y-4 px-6 pt-5" role="status">
          <Panel>
            <DemoBadge label="نتيجة تجريبية" />
            <p className="text-ink dark:text-night-ink mt-2 text-right text-[14px] leading-7 font-extrabold">
              {mode === "forgot" ? "اتحاكى إرسال رابط الاسترجاع." : mode === "up" ? "اتحاكى إنشاء الحساب." : "اتحاكى تسجيل الدخول."}
            </p>
            <p className="text-ink/65 dark:text-night-ink/65 mt-1 text-right text-[12px] leading-6">مفيش خادم متصل: مفيش حساب اتفتح ولا رسالة اتبعتت ولا بيانات اتحفظت.</p>
          </Panel>
          <Link href={mode === "in" ? next : "/account"} className="bg-primary block w-full rounded-full py-3.5 text-center text-sm font-extrabold text-white">{mode === "in" && next !== "/account" ? "كمّل لحيث كنت" : "رجوع للحساب"}</Link>
        </section>
      </Screen>
    );
  }

  return (
    <Screen title={TITLES[mode]} backHref="/account">
      <section className="space-y-4 px-6 pt-5">
        <Panel>
          <DemoBadge label="وضع تجريبي" />
          <p className="text-ink/65 dark:text-night-ink/65 mt-2 text-right text-[12px] leading-6">الخادم مش متصل. النموذج بيتجرّب على محاكاة: مفيش كلمة مرور بتتبعت أو بتتحفظ، ومفيش جلسة بتتفتح. اختار نتيجة المحاكاة عشان تجرّب الحالات.</p>
          <div role="group" aria-label="نتيجة المحاكاة" className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(DEMO_SCENARIOS) as DemoScenario[]).map((s) => (
              <button key={s} type="button" aria-pressed={scenario === s} disabled={busy} onClick={() => setScenario(s)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${scenario === s ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{DEMO_SCENARIOS[s]}</button>
            ))}
          </div>
        </Panel>
        {expired && <p role="alert" className="text-primary text-right text-[13px] font-bold">الجلسة انتهت. سجّل الدخول تاني وهترجع لنفس المكان. (حالة تجريبية: مفيش جلسة حقيقية)</p>}
        <form onSubmit={submit} noValidate aria-busy={busy} className="space-y-3">
          {mode === "up" && (
            <>
              <label htmlFor="a-name" className="text-ink dark:text-night-ink block text-right text-[13px] font-bold">الاسم</label>
              <input id="a-name" value={name} maxLength={30} autoComplete="name" disabled={busy} onChange={(e) => setName(e.target.value)} className={field} {...inv("name")} />
              {err("name")}
            </>
          )}
          <label htmlFor="a-email" className="text-ink dark:text-night-ink block text-right text-[13px] font-bold">البريد الإلكتروني</label>
          <input id="a-email" type="email" dir="ltr" value={email} autoComplete="email" disabled={busy} onChange={(e) => setEmail(e.target.value)} className={field} {...inv("email")} />
          {err("email")}
          {mode !== "forgot" && (
            <>
              <label htmlFor="a-pw" className="text-ink dark:text-night-ink block text-right text-[13px] font-bold">كلمة المرور</label>
              <div className="flex gap-2">
                <input id="a-pw" type={showPw ? "text" : "password"} dir="ltr" value={password} autoComplete={mode === "in" ? "current-password" : "new-password"} disabled={busy} onChange={(e) => setPassword(e.target.value)} className={field} {...inv("password")} />
                <button type="button" aria-pressed={showPw} onClick={() => setShowPw((v) => !v)} className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink shrink-0 rounded-2xl px-3 text-[12px] font-bold">{showPw ? "إخفاء" : "إظهار"}</button>
              </div>
              {err("password")}
            </>
          )}
          {mode === "up" && (
            <>
              <label htmlFor="a-confirm" className="text-ink dark:text-night-ink block text-right text-[13px] font-bold">تأكيد كلمة المرور</label>
              <input id="a-confirm" type={showPw ? "text" : "password"} dir="ltr" value={confirm} autoComplete="new-password" disabled={busy} onChange={(e) => setConfirm(e.target.value)} className={field} {...inv("confirm")} />
              {err("confirm")}
            </>
          )}
          {formError && <p role="alert" className="text-primary text-right text-[13px] font-bold">{formError}</p>}
          <button type="submit" disabled={busy} className="bg-primary w-full rounded-full py-3.5 text-sm font-extrabold text-white transition-transform active:scale-95 disabled:opacity-60">
            {busy ? "جاري التنفيذ…" : formError ? "جرّب تاني" : mode === "in" ? "دخول" : mode === "up" ? "إنشاء الحساب" : "ابعت رابط الاسترجاع"}
          </button>
        </form>
        <nav className="text-ink/70 dark:text-night-ink/70 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] font-bold">
          {mode !== "in" && <Link href="/account/login">عندي حساب</Link>}
          {mode !== "up" && <Link href="/account/register">إنشاء حساب</Link>}
          {mode === "in" && <Link href="/account/forgot">نسيت كلمة المرور؟</Link>}
        </nav>
        <div className="border-card-border dark:border-card-border-dark space-y-2 border-t pt-4">
          <p className="text-ink/65 dark:text-night-ink/65 text-right text-[12px] leading-6">أو كمّل بدون حساب: ملف محلي باسمك على الجهاز ده بس.</p>
          {mode !== "up" && <input aria-label="اسمك على الجهاز ده" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} className={field} {...inv("name")} />}
          {mode !== "up" && err("name")}
          <button type="button" onClick={startLocal} disabled={busy} className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink w-full rounded-full py-3 text-sm font-extrabold">ابدأ بملف محلي</button>
        </div>
      </section>
    </Screen>
  );
}
