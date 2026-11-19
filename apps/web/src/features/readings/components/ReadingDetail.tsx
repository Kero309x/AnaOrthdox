"use client";

import { localStore } from "@/shared/lib/storage";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { BookIcon, ChevronLeftIcon, ChevronRightIcon, TypeIcon } from "@/shared/ui/icons";
import { formatCopticDate, gregorianToCoptic } from "@/domain/calendar/coptic";
import { slotById } from "@/domain/readings/slots";

const gregorianFull = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const READING_FONT_KEY = "readingFontScale";
const FONT_STEPS = [90, 100, 110, 125];

// The reading detail screen from the concept: the day navigation shows the
// real Coptic and Gregorian date of that day, the font control really
// changes the reading size and persists, while the text itself stays an
// honest placeholder until a licensed lectionary source exists.
export default function ReadingDetail() {
  const { dark, toggleTheme } = useTheme();
  const params = useParams<{ slot: string }>();
  const slot = slotById(params.slot);
  const [dayOffset, setDayOffset] = useState(0);
  const [fontStep, setFontStep] = useState(1);

  useEffect(() => {
    const saved = Number(localStore.getItem(READING_FONT_KEY));
    const index = FONT_STEPS.indexOf(saved);
    if (index >= 0) setFontStep(index);
  }, []);

  function changeFont(delta: number) {
    setFontStep((current) => {
      const next = Math.min(FONT_STEPS.length - 1, Math.max(0, current + delta));
      localStore.setItem(READING_FONT_KEY, String(FONT_STEPS[next]));
      return next;
    });
  }

  const day = new Date();
  day.setDate(day.getDate() + dayOffset);
  const coptic = gregorianToCoptic(
    day.getFullYear(),
    day.getMonth() + 1,
    day.getDate(),
  );

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="قراءة اليوم"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/readings"
        />

        <section className="px-6 pt-5">
          <div className="rounded-3xl border border-card-border bg-white p-5 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <div className="flex items-center gap-3">
              <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-11 w-11 shrink-0 items-center justify-center">
                <BookIcon className="h-5 w-5" />
              </span>
              <span className="bg-gold-badge text-gold-ink rounded-full px-3 py-1 text-xs font-bold">
                محتوى تجريبي
              </span>
            </div>
            <p className="text-ink dark:text-night-ink mt-4 text-right text-xl font-black">
              {slot ? slot.name : "عنوان القراءة هيظهر هنا"}
            </p>
            <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-right text-[12px]">
              {gregorianFull.format(day)} • {formatCopticDate(coptic)}
            </p>

            {/* Placeholder lines stand where the licensed text will render. */}
            <div className="mt-5 space-y-3" aria-hidden="true">
              {[100, 92, 96, 70, 88, 55].map((width, i) => (
                <div
                  key={i}
                  className="bg-rose-badge dark:bg-night-chip h-3.5 rounded-full"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
            <p
              className="text-ink/60 dark:text-night-ink/60 mt-5 text-right leading-7"
              style={{ fontSize: `${FONT_STEPS[fontStep] / 100}rem` }}
            >
              نص القراءة هيظهر هنا بعد تفعيل الخاصية بمصدر ليتورجي معتمد.
              المعروض حالياً مجرد مكان شكلي للتصميم.
            </p>
          </div>
        </section>

        <section className="px-6 pt-4">
          <div className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center">
              <TypeIcon className="h-5 w-5" />
            </span>
            <span className="text-ink dark:text-night-ink flex-1 text-right text-[15px] font-extrabold">
              حجم الخط
            </span>
            <button
              type="button"
              onClick={() => changeFont(-1)}
              disabled={fontStep === 0}
              aria-label="تصغير الخط"
              className="bg-rose-badge text-primary flex h-11 w-11 items-center justify-center rounded-full text-xl font-black transition-transform active:scale-95 disabled:opacity-35"
            >
              أ-
            </button>
            <button
              type="button"
              onClick={() => changeFont(1)}
              disabled={fontStep === FONT_STEPS.length - 1}
              aria-label="تكبير الخط"
              className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-xl font-black text-white transition-transform active:scale-95 disabled:opacity-35"
            >
              أ+
            </button>
          </div>
        </section>

        <section className="px-6 pt-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDayOffset((current) => current - 1)}
              className="border-primary text-primary dark:text-rose flex flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] py-3 text-sm font-extrabold transition-transform active:scale-95"
            >
              <ChevronRightIcon className="h-4 w-4" />
              اليوم السابق
            </button>
            <button
              type="button"
              onClick={() => setDayOffset((current) => current + 1)}
              className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-extrabold transition-transform active:scale-95"
            >
              اليوم التالي
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          </div>
          {dayOffset !== 0 && (
            <p className="text-ink/50 dark:text-night-ink/50 pt-2 text-center text-[11px]">
              التاريخ المعروض حقيقي ومحسوب بالتقويمين، ونص القراءة لسه قريباً.
            </p>
          )}
        </section>

        {!slot && (
          <p className="px-8 pt-4 text-center text-[12px]">
            <Link href="/readings" className="text-primary font-bold underline">
              رجوع لقائمة قراءات اليوم
            </Link>
          </p>
        )}

        <BottomNav />
      </main>
    </div>
  );
}
