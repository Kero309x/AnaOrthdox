"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { BookIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, TypeIcon } from "@/shared/ui/icons";
import { EmptyState, Skeleton } from "@/shared/ui/kit";
import { localStore } from "@/shared/lib/storage";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { AGPEYA_HOURS, BUNDLED } from "@/domain/agpeya/hours";
import { gapsFor, MISSING_EVERYWHERE } from "@/domain/agpeya/gaps";
import type { AgpeyaBlock, AgpeyaHour } from "@/domain/agpeya/types";
import { toArabicNumber } from "@/domain/calendar/coptic";

const FONT_KEY = "agpeyaFontScale";
const FONT_STEPS = [90, 100, 115, 135];
const none: string[] = [];
const card = "rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none";

type State = { status: "loading" } | { status: "error"; reason: "network" | "bad" } | { status: "ready"; hour: AgpeyaHour };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function Counter({ total }: { total: number }) {
  const [n, setN] = useState(0);
  return (
    <div>
      <p className="text-ink/60 dark:text-night-ink/60 mt-1 text-[11px]">للمساعدة في العدّ فقط، ومش تكرار إضافي. التعليمات الأصلية هي العدد المكتوب فوق.</p>
      <div className="mt-2 flex items-center gap-2" role="group" aria-label="عدّاد التكرار">
      <button type="button" onClick={() => setN((c) => Math.min(total, c + 1))} className="bg-primary rounded-full px-5 py-2 text-[13px] font-bold text-white">عدّ</button>
      <span className="text-primary-deep dark:text-night-ink text-[14px] font-extrabold" aria-live="polite">{toArabicNumber(n)} من {toArabicNumber(total)}</span>
      <button type="button" onClick={() => setN(0)} disabled={n === 0} className="bg-blush dark:bg-night-chip rounded-full px-4 py-2 text-[12px] font-bold disabled:opacity-40">من الأول</button>
      </div>
    </div>
  );
}

function Block({ b, anchor }: { b: AgpeyaBlock; anchor?: string }) {
  return (
    <section id={anchor} className={`${card} scroll-mt-4`} aria-label={b.title || undefined}>
      {b.title && <h2 className="text-primary-deep dark:text-night-ink text-[15px] font-extrabold">{b.title}</h2>}
      {b.type === "verses" && b.reference && b.reference !== b.title && (
        <p className="text-nav-label dark:text-night-ink/60 mt-0.5 text-[11px] font-bold" dir="ltr">{b.reference}</p>
      )}
      {b.rubric && <p className="text-gold-ink mt-1 text-[12px] font-bold">{b.rubric}</p>}
      {b.type === "prose" && b.repeat ? <Counter total={b.repeat} /> : b.type === "prose" ? (
        <div className="text-ink dark:text-night-ink mt-2 space-y-2 leading-[2]" style={{ fontSize: "calc(var(--agpeya-scale, 100) * 0.16px)" }}>
          {b.lines.map((l, i) => <p key={i} className={l.response ? "text-primary-deep dark:text-night-ink/90 font-bold" : undefined}>{l.text}</p>)}
        </div>
      ) : (
        <ol className="text-ink dark:text-night-ink mt-2 space-y-1 leading-[2]" style={{ fontSize: "calc(var(--agpeya-scale, 100) * 0.16px)" }}>
          {b.verses.map((v) => (
            <li key={v.num} className="flex gap-2"><span className="text-nav-label dark:text-night-ink/50 w-6 shrink-0 text-[11px] font-bold">{toArabicNumber(v.num)}</span><span>{v.text}</span></li>
          ))}
        </ol>
      )}
    </section>
  );
}

type Entry = { anchor: string; title: string; watch?: boolean; sub?: boolean };

function entriesOf(hour: AgpeyaHour): Entry[] {
  const label = (b: AgpeyaBlock) => {
    const n = /psalm_(\d+)/.exec(b.id)?.[1];
    const t = b.title || (/_start$/.test(b.id) ? "بدء الصلاة" : "");
    return t && n ? `${t} (${toArabicNumber(Number(n))})` : t;
  };
  const out: Entry[] = [];
  hour.items.forEach((it, i) => {
    if (it.type === "watch") {
      out.push({ anchor: `s-${i}`, title: it.title, watch: true });
      it.blocks.forEach((b, j) => { const t = label(b); if (t) out.push({ anchor: `s-${i}-${j}`, title: t, sub: true }); });
    } else { const t = label(it); if (t) out.push({ anchor: `s-${i}`, title: t }); }
  });
  return out;
}

const digits = (x: string) => x.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

function Contents({ hour, entries }: { hour: AgpeyaHour; entries: Entry[] }) {
  const [q, setQ] = useState("");
  const needle = digits(q.trim());
  const shown = needle ? entries.filter((e) => digits(e.title).includes(needle)) : entries;
  return (
    <details className={card}>
      <summary className="text-primary-deep dark:text-night-ink cursor-pointer text-right text-[14px] font-extrabold">فهرس الصلاة ({toArabicNumber(entries.length)})</summary>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوّر باسم المزمور أو رقمه" aria-label="دوّر في الفهرس" className="bg-blush dark:bg-night-chip mt-2 w-full rounded-full px-4 py-2 text-right text-[13px]" />
      <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-right text-[13px]">
        {shown.map((e) => (
          <li key={e.anchor}><a href={`#${e.anchor}`} className={`block rounded-xl px-2 py-1.5 ${e.watch ? "text-primary font-extrabold" : "text-ink dark:text-night-ink"} ${e.sub ? "pe-5" : ""}`}>{e.title}</a></li>
        ))}
        {shown.length === 0 && <li className="text-ink/60 px-2 py-1.5">مفيش نتيجة بالاسم ده</li>}
      </ul>
    </details>
  );
}

export default function AgpeyaReader({ slug }: { slug: string }) {
  const { dark, toggleTheme } = useTheme();
  const index = AGPEYA_HOURS.findIndex((h) => h.id === slug);
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [fontStep, setFontStep] = useState(1);
  const [done, setDone] = useStored("done.prayers", none, isStringArray);
  const [today, setToday] = useState("");
  useEffect(() => setToday(todayKey()), []);

  useEffect(() => {
    const i = FONT_STEPS.indexOf(Number(localStore.getItem(FONT_KEY)));
    if (i >= 0) setFontStep(i);
  }, []);

  const load = useCallback(() => {
    const ctl = new AbortController();
    setState({ status: "loading" });
    (async () => {
      try {
        const res = await fetch(`/api/agpeya/${slug}`, { signal: ctl.signal });
        if (!res.ok) return setState({ status: "error", reason: "network" });
        const hour = (await res.json()) as AgpeyaHour;
        if (!hour || !Array.isArray(hour.items) || hour.items.length === 0) return setState({ status: "error", reason: "bad" });
        setState({ status: "ready", hour });
      } catch (e) {
        if ((e as Error).name !== "AbortError") setState({ status: "error", reason: "network" });
      }
    })();
    return () => ctl.abort();
  }, [slug]);
  useEffect(() => load(), [load, attempt]);

  function changeFont(delta: number) {
    setFontStep((c) => {
      const n = Math.min(FONT_STEPS.length - 1, Math.max(0, c + delta));
      localStore.setItem(FONT_KEY, String(FONT_STEPS[n]));
      return n;
    });
  }

  const key = `${today}:${slug}`;
  const gaps = [...gapsFor(slug), MISSING_EVERYWHERE].filter(Boolean);
  const entries = useMemo(() => (state.status === "ready" ? entriesOf(state.hour) : []), [state]);
  const [lastAnchor, setLastAnchor] = useStored<string>(`agpeyaLast:${slug}`, "", (v): v is string => typeof v === "string");
  const seen = useRef("");
  const resume = state.status === "ready" ? entries.find((e) => e.anchor === lastAnchor) : undefined;
  useEffect(() => {
    if (state.status !== "ready") return;
    const h = window.location.hash.slice(1);
    if (h) document.getElementById(h)?.scrollIntoView();
    const io = new IntersectionObserver((rows) => {
      const top = rows.filter((r) => r.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top && window.scrollY > 200 && top.target.id !== seen.current) { seen.current = top.target.id; setLastAnchor(top.target.id); }
    }, { rootMargin: "0px 0px -70% 0px" });
    document.querySelectorAll('section[id^="s-"]').forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);
  const isDone = done.includes(key);
  const prev = index > 0 ? AGPEYA_HOURS[index - 1] : undefined, next = index >= 0 ? AGPEYA_HOURS[index + 1] : undefined;
  const title = state.status === "ready" ? state.hour.name : "الأجبية";

  return (
    <div id="top" className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-40" style={{ ["--agpeya-scale" as string]: FONT_STEPS[fontStep] }}>
        <Header title={title} dark={dark} onToggleTheme={toggleTheme} back backHref="/prayers" />

        <div className="flex items-center justify-start px-6 pt-4">
          <div className="flex items-center gap-2" role="group" aria-label="حجم الخط">
            <button type="button" aria-label="تصغير الخط" disabled={fontStep === 0} onClick={() => changeFont(-1)} className="bg-blush dark:bg-night-chip flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"><TypeIcon className="h-4 w-4" /></button>
            <button type="button" aria-label="تكبير الخط" disabled={fontStep === FONT_STEPS.length - 1} onClick={() => changeFont(1)} className="bg-blush dark:bg-night-chip flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"><TypeIcon className="h-6 w-6" /></button>
          </div>
        </div>

        <div className="space-y-3 px-6 pt-4" aria-live="polite" aria-busy={state.status === "loading"}>
          {state.status === "loading" && (
            <div role="status" aria-label="جاري تحميل الصلاة" className="space-y-3">
              <Skeleton className="h-28" /><Skeleton className="h-40" /><Skeleton className="h-40" />
            </div>
          )}
          {state.status === "error" && (
            <EmptyState
              icon={<BookIcon className="h-6 w-6" />}
              title="مقدرناش نحمّل نص الصلاة"
              hint={state.reason === "bad" ? "المصدر رجّع نص غير مكتمل، فمش هنعرض نص ناقص." : "المصدر مش متاح دلوقتي أو النت ضعيف. مفيش نص بديل بنعرضه بدل الأصلي."}
              action={{ label: "جرّب تاني", onClick: () => setAttempt((a) => a + 1) }}
            />
          )}
          {state.status === "ready" && (
            <>
              {resume && resume.anchor !== "s-0" && (
                <a href={`#${resume.anchor}`} className="bg-primary block w-full rounded-full px-5 py-3 text-center text-[13px] font-bold text-white">كمّل من حيث وقفت: {resume.title}</a>
              )}
              <Contents hour={state.hour} entries={entries} />
              {gaps.length > 0 && (
                <div className="bg-gold-soft text-gold-ink rounded-3xl px-4 py-3 text-right text-[12px] leading-6" role="note">
                  <p className="font-extrabold">المصدر مش كامل لهذه الساعة</p>
                  <ul className="list-disc pe-4">{gaps.map((g) => <li key={g}>{g}</li>)}</ul>
                  <p className="mt-1">النقص ظاهر بمقارنة آلية مع صفحة واحدة، ومحتاج مراجعة مع الأجبية المطبوعة.</p>
                </div>
              )}
              {state.hour.items.map((item, i) =>
                item.type === "watch" ? (
                  <div key={`${item.id}-${i}`} id={`s-${i}`} className="scroll-mt-4 space-y-3">
                    <h2 className="bg-rose-badge text-primary rounded-3xl px-5 py-3 text-right text-[15px] font-extrabold">{item.title}{item.theme ? ` · ${item.theme}` : ""}</h2>
                    {item.blocks.map((b, j) => <Block key={`${b.id}-${j}`} b={b} anchor={`s-${i}-${j}`} />)}
                  </div>
                ) : (
                  <Block key={`${item.id}-${i}`} b={item} anchor={`s-${i}`} />
                ),
              )}
              <button type="button" aria-pressed={isDone} disabled={!today} onClick={() => setDone((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p.filter((x) => x.startsWith(today) || p.length < 400), key]))} className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-bold ${isDone ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>
                {isDone && <CheckIcon className="h-4 w-4" />}{isDone ? "صلّيت" : "علّم إنك صلّيت"}
              </button>
              <nav className="flex justify-between gap-3" aria-label="الساعات">
                {next ? <Link href={`/prayers/${next.id}`} className="bg-blush dark:bg-night-chip flex items-center gap-1 rounded-full px-4 py-2.5 text-[13px] font-bold"><ChevronRightIcon className="h-4 w-4" />الساعة التالية</Link> : <span />}
                {prev ? <Link href={`/prayers/${prev.id}`} className="bg-blush dark:bg-night-chip flex items-center gap-1 rounded-full px-4 py-2.5 text-[13px] font-bold">الساعة السابقة<ChevronLeftIcon className="h-4 w-4" /></Link> : <span />}
              </nav>
            </>
          )}
          <p className="text-ink/50 dark:text-night-ink/50 px-2 pb-2 text-[11px] leading-5">
            {BUNDLED ? "مصدر النص: بيانات تطبيق Agpeya المفتوح (Abanoub Hanna، ترخيص MIT)، والمردات القبطية المختصرة فيه مكتوبة كاملة كما في موقع الأنبا تكلا. راجعه مع الأجبية المطبوعة اللي بتستخدمها كنيستك." : "مصدر النص: واجهة coptic.io العامة، والنص العربي فيها منقول بحسب المشروع عن موقع الأنبا تكلا. ده مش إذن بإعادة النشر، وحقوق النص لأصحابها. راجعه مع الأجبية المطبوعة اللي بتستخدمها كنيستك."}
          </p>
          <a href="#top" className="text-primary block px-2 pb-4 text-right text-[12px] font-bold underline">للأعلى</a>
        </div>
        <BottomNav />
      </main>
    </div>
  );
}
