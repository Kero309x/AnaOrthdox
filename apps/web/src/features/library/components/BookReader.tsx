"use client";

import { toArabicNumber } from "@/domain/calendar/coptic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { books } from "@/data/catalog";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, EmptyState, FavButton, Panel, ProgressBar, Screen, useShowToast, cardCls } from "@/shared/ui/kit";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, OpenBookIcon, StarIcon } from "@/shared/ui/icons";

const none: string[] = [];
const noRec: Record<string, unknown> = {};
const noMarks: Record<string, unknown> = {};
const SIZES = [15, 17, 19, 22];

export default function BookReader() {
  const id = useSearchParams().get("id");
  const book = books.find((b) => b.id === id);
  return (
    <Screen title={book ? book.title : "القراءة"} backHref="/books">
      {book ? <Reader id={book.id} /> : (
        <section className="px-6 pt-6"><EmptyState icon={<OpenBookIcon className="h-6 w-6" />} title="الكتاب ده مش موجود" hint="ممكن يكون اتشال أو الرابط ناقص." action={{ label: "كل الكتب", href: "/books" }} /></section>
      )}
    </Screen>
  );
}

function Reader({ id }: { id: string }) {
  const book = books.find((b) => b.id === id)!;
  const showToast = useShowToast();
  const [pagesAt, setPagesAt] = useStored("page.book", noRec, isRecord);
  const [marks, setMarks] = useStored("bookmarks.book", noMarks, isRecord);
  const [favs, setFavs] = useStored("fav.book", none, isStringArray);
  const [downloaded, setDownloaded] = useStored("downloaded.book", none, isStringArray);
  const [step, setStep] = useStored<number>("readerSize", 1, (v): v is number => typeof v === "number" && v >= 0 && v < SIZES.length);
  const raw = typeof pagesAt[id] === "number" ? (pagesAt[id] as number) : 0;
  const page = Math.min(Math.max(raw, 0), book.pages.length - 1);
  const bookmarked = Array.isArray(marks[id]) && (marks[id] as number[]).includes(page);
  const go = (p: number) => setPagesAt((prev) => ({ ...prev, [id]: Math.min(Math.max(p, 0), book.pages.length - 1) }));
  const toggleMark = () => {
    setMarks((prev) => {
      const list = Array.isArray(prev[id]) ? (prev[id] as number[]) : [];
      return { ...prev, [id]: list.includes(page) ? list.filter((x) => x !== page) : [...list, page].sort((a, b) => a - b) };
    });
    showToast(bookmarked ? "اتشالت العلامة" : "اتحطت علامة على الصفحة");
  };
  const list = Array.isArray(marks[id]) ? (marks[id] as number[]) : [];
  const download = () => {
    const text = `${book.title}\n${book.author}\n\n${book.pages.join("\n\n")}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.id}-demo.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloaded((p) => (p.includes(id) ? p : [...p, id]));
    showToast("اتحمّلت نسخة تجريبية على جهازك");
  };

  return (
    <section className="px-6 pt-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2"><DemoBadge /><span className="text-ink/60 dark:text-night-ink/60 text-[12px] font-bold">{book.author}</span></span>
        <span className="flex items-center gap-2">
          <button type="button" aria-label="تصغير الخط" disabled={step === 0} onClick={() => setStep(step - 1)} className="bg-rose-badge text-primary h-10 w-10 rounded-full text-lg font-black active:scale-95 disabled:opacity-40">−</button>
          <button type="button" aria-label="تكبير الخط" disabled={step === SIZES.length - 1} onClick={() => setStep(step + 1)} className="bg-primary h-10 w-10 rounded-full text-lg font-black text-white active:scale-95 disabled:opacity-40">+</button>
        </span>
      </div>

      <article className={`${cardCls} mt-4 min-h-64 p-5`} aria-live="polite">
        <p className="text-ink dark:text-night-ink text-right leading-9" style={{ fontSize: SIZES[step] }}>{book.pages[page]}</p>
      </article>

      <div className="pt-3"><ProgressBar value={((page + 1) / book.pages.length) * 100} /></div>
      <div className="flex items-center justify-between pt-3">
        <button type="button" onClick={() => go(page + 1)} disabled={page === book.pages.length - 1} className="bg-primary flex items-center gap-1 rounded-full px-5 py-3 text-[13px] font-bold text-white active:scale-95 disabled:opacity-40"><ChevronRightIcon className="h-4 w-4" />التالي</button>
        <span className="text-ink/60 dark:text-night-ink/60 text-[12px] font-bold">صفحة {toArabicNumber(page + 1)} من {toArabicNumber(book.pages.length)}</span>
        <button type="button" onClick={() => go(page - 1)} disabled={page === 0} className="bg-rose-badge text-primary flex items-center gap-1 rounded-full px-5 py-3 text-[13px] font-bold active:scale-95 disabled:opacity-40">السابق<ChevronLeftIcon className="h-4 w-4" /></button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
        <button type="button" aria-pressed={bookmarked} onClick={toggleMark} className={`flex h-12 items-center gap-2 rounded-full px-5 text-[13px] font-extrabold active:scale-95 ${bookmarked ? "bg-primary text-white" : "bg-rose-badge text-primary"}`}><StarIcon className="h-4 w-4" />علامة</button>
        <FavButton active={favs.includes(id)} onToggle={() => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))} label={book.title} />
        <button type="button" onClick={download} className="bg-gold-soft text-gold-ink flex h-12 items-center gap-2 rounded-full px-5 text-[13px] font-extrabold active:scale-95"><DownloadIcon className="h-4 w-4" />{downloaded.includes(id) ? "محمّل" : "تنزيل"}</button>
      </div>

      {list.length > 0 && (
        <div className="pt-5"><Panel>
          <p className="text-ink dark:text-night-ink text-right text-[13px] font-extrabold">علاماتك</p>
          <div className="mt-2 flex flex-wrap gap-2">{list.map((p) => <button key={p} type="button" onClick={() => go(p)} className="bg-rose-badge text-primary rounded-full px-4 py-1.5 text-[12px] font-bold">صفحة {toArabicNumber(p + 1)}</button>)}</div>
        </Panel></div>
      )}
      <p className="pt-4 text-center"><Link href="/books" className="text-primary text-[13px] font-bold underline">كل الكتب</Link></p>
      <DemoNote>النص تجريبي لعرض تجربة القراءة. آخر صفحة وعلاماتك بتتحفظ على جهازك.</DemoNote>
    </section>
  );
}
