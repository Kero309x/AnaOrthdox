"use client";

import { useRef, useState } from "react";
import { isRecord, useStored } from "@/shared/lib/useStored";
import { Panel, ProgressBar, Screen, SectionHeading, useShowToast } from "@/shared/ui/kit";

// Coptic month names only. Order and numbers: Pope Tawadros II, "The Coptic calendar"
// (copticorthodox.church). Tobi 11 = Theophany and Mesra 1 = start of the Virgin's fast:
// see docs/frontend/quiz-sources.md. Layout was generated and checked by script.
type Entry = { w: string; a: string; r: number; c: number; d: "A" | "D"; clue: string };
const ENTRIES: Entry[] = [
  { w: "بؤونة", a: "بوونة", r: 0, c: 0, d: "A", clue: "الشهر العاشر في السنة القبطية" },
  { w: "برمهات", a: "برمهات", r: 0, c: 0, d: "D", clue: "الشهر السابع في السنة القبطية" },
  { w: "طوبة", a: "طوبة", r: 2, c: 5, d: "D", clue: "الشهر الخامس، وفيه عيد الغطاس يوم ١١" },
  { w: "هاتور", a: "هاتور", r: 3, c: 2, d: "D", clue: "الشهر الثالث في السنة القبطية" },
  { w: "أبيب", a: "ابيب", r: 4, c: 2, d: "A", clue: "الشهر الحادي عشر في السنة القبطية" },
  { w: "توت", a: "توت", r: 5, c: 0, d: "A", clue: "أول شهر في السنة القبطية" },
  { w: "مسرى", a: "مسرى", r: 7, c: 0, d: "A", clue: "الشهر الثاني عشر، وصوم السيدة العذراء بيبدأ من أوله" },
];
const ROWS = 8;
const COLS = 6;
const fold = (s: string) => s.replace(/[\u064B-\u065F\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي");
const key = (r: number, c: number) => `${r},${c}`;

function build() {
  const sol: Record<string, string> = {};
  const starts: Record<string, number> = {};
  for (const e of ENTRIES) [...e.a].forEach((ch, i) => { sol[e.d === "A" ? key(e.r, e.c + i) : key(e.r + i, e.c)] = ch; });
  const order = [...ENTRIES].sort((x, y) => x.r - y.r || x.c - y.c);
  let n = 0;
  const numbers = new Map<Entry, number>();
  for (const e of order) { const k = key(e.r, e.c); if (!(k in starts)) starts[k] = ++n; numbers.set(e, starts[k]); }
  return { sol, starts, numbers };
}

const { sol, starts, numbers } = build();

export default function Crossword() {
  const [vals, setVals] = useStored<Record<string, unknown>>("crossword.v1", {}, isRecord);
  const [sel, setSel] = useState<string | null>(null);
  const [dir, setDir] = useState<"A" | "D">("A");
  const [checked, setChecked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const toast = useShowToast();

  const val = (k: string) => (typeof vals[k] === "string" ? (vals[k] as string) : "");
  const total = Object.keys(sol).length;
  const right = Object.keys(sol).filter((k) => fold(val(k)) === fold(sol[k])).length;
  const done = right === total;

  const nextCell = (k: string) => {
    const [r, c] = k.split(",").map(Number);
    const n = dir === "A" ? key(r, c + 1) : key(r + 1, c);
    return n in sol ? n : k;
  };
  function type(ch: string) {
    if (!sel) return;
    const letter = ch.trim().slice(-1);
    if (!/[\u0621-\u064A]/.test(letter)) { if (letter) toast("اكتب حرف عربي"); return; }
    setVals({ ...vals, [sel]: letter });
    setChecked(false);
    setSel(nextCell(sel));
  }
  function erase() { if (sel) { setVals({ ...vals, [sel]: "" }); setChecked(false); } }
  function hint() {
    const empty = Object.keys(sol).find((k) => fold(val(k)) !== fold(sol[k]));
    if (!empty) return;
    setVals({ ...vals, [empty]: sol[empty] });
    setSel(empty);
    toast("اتكشف حرف");
  }
  function pick(k: string) {
    if (sel === k) setDir((d) => (d === "A" ? "D" : "A"));
    setSel(k);
    input.current?.focus();
  }

  return (
    <Screen title="كلمات متقاطعة" backHref="/games" intro="اكتب أسماء الشهور القبطية في الشبكة. اضغط خانة واكتب الحرف.">
      <section className="space-y-3 px-6 pt-4">
        <Panel>
          <div className="flex items-center gap-3"><span className="text-ink dark:text-night-ink text-[12px] font-bold">{right} من {total}</span><div className="flex-1"><ProgressBar value={(right / total) * 100} /></div></div>
        </Panel>
        <div dir="rtl" role="grid" aria-label="شبكة الكلمات المتقاطعة" className="mx-auto grid max-w-[320px] gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const r = Math.floor(i / COLS), c = i % COLS, k = key(r, c);
            if (!(k in sol)) return <span key={k} aria-hidden className="aspect-square" />;
            const v = val(k);
            const bad = checked && v && fold(v) !== fold(sol[k]);
            const good = checked && v && !bad;
            return (
              <button key={k} type="button" role="gridcell" aria-label={`خانة صف ${r + 1} عمود ${c + 1}${v ? ` الحرف ${v}` : " فاضية"}`} aria-selected={sel === k} onClick={() => pick(k)}
                className={`relative aspect-square rounded-xl text-[18px] font-extrabold transition-colors ${sel === k ? "bg-primary text-white" : bad ? "bg-rose-badge text-primary ring-2 ring-[var(--color-primary)]" : good ? "bg-gold-soft text-gold-ink" : "bg-rose/70 text-ink dark:bg-night-chip dark:text-night-ink"}`}>
                {starts[k] && <span className="absolute top-0.5 right-1 text-[9px] font-bold opacity-70">{starts[k]}</span>}
                {v}
              </button>
            );
          })}
        </div>
        <input ref={input} aria-label="اكتب الحرف" value="" inputMode="text" lang="ar" dir="rtl" autoComplete="off" onChange={(e) => type(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Backspace") erase(); }} placeholder={sel ? `اكتب حرف الخانة المختارة (${dir === "A" ? "أفقي" : "رأسي"})` : "اختار خانة الأول"} disabled={!sel}
          className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink w-full rounded-full px-5 py-3 text-center text-[14px] outline-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={erase} disabled={!sel} className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full py-2.5 text-[13px] font-bold disabled:opacity-50">مسح الخانة</button>
          <button type="button" onClick={() => setDir((d) => (d === "A" ? "D" : "A"))} className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full py-2.5 text-[13px] font-bold">الاتجاه: {dir === "A" ? "أفقي" : "رأسي"}</button>
          <button type="button" onClick={() => setChecked(true)} className="bg-primary rounded-full py-2.5 text-[13px] font-bold text-white">تحقق</button>
          <button type="button" onClick={hint} disabled={done} className="bg-gold text-gold-ink rounded-full py-2.5 text-[13px] font-bold disabled:opacity-50">اكشف حرف</button>
        </div>
        <div aria-live="polite" role="status">
          {done && <Panel><p className="text-right text-[14px] font-extrabold">كملت الشبكة كلها.</p></Panel>}
          {checked && !done && <p className="text-right text-[12px] font-bold">الخانات الغلط متعلّمة بإطار. صحّحها وجرّب تحقق تاني.</p>}
        </div>
        {(["A", "D"] as const).map((d) => (
          <div key={d}>
            <SectionHeading>{d === "A" ? "أفقي" : "رأسي"}</SectionHeading>
            <ul className="space-y-1.5 pt-2">
              {ENTRIES.filter((e) => e.d === d).map((e) => (
                <li key={e.w}><button type="button" onClick={() => { setDir(d); pick(key(e.r, e.c)); }} className="text-ink dark:text-night-ink w-full text-right text-[13px] leading-6"><b>{numbers.get(e)}.</b> {e.clue} <span className="opacity-60">({e.a.length} حروف)</span></button></li>
              ))}
            </ul>
          </div>
        ))}
        {confirmReset ? (
          <div className="flex gap-2"><button type="button" className="bg-primary flex-1 rounded-full py-2.5 text-[13px] font-bold text-white" onClick={() => { setVals({}); setChecked(false); setConfirmReset(false); toast("اتمسحت الشبكة"); }}>تأكيد مسح الشبكة</button><button type="button" className="bg-rose text-primary-deep rounded-full px-6 text-[13px] font-bold" onClick={() => setConfirmReset(false)}>تراجع</button></div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} disabled={right === 0 && Object.keys(vals).length === 0} className="text-primary w-full py-2 text-center text-[13px] font-bold disabled:opacity-40">ابدأ من الأول</button>
        )}
      </section>
    </Screen>
  );
}
