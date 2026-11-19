"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  COPTIC_MONTHS,
  OCCASIONS,
  copticMonthLength,
  copticToJd,
  gregorianToCoptic,
  jdToGregorian,
  toArabicNumber,
} from "@/domain/calendar/coptic";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icons";

const gregorianDayMonth = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function CopticCalendar() {
  const { dark, toggleTheme } = useTheme();

  const now = new Date();
  const today = gregorianToCoptic(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  const [view, setView] = useState({ year: today.year, month: today.month });

  function shift(delta: number) {
    setView((current) => {
      let month = current.month + delta;
      let year = current.year;
      if (month > 13) {
        month = 1;
        year += 1;
      }
      if (month < 1) {
        month = 13;
        year -= 1;
      }
      return { year, month };
    });
  }

  const length = copticMonthLength(view.year, view.month);
  const days = Array.from({ length }, (_, i) => i + 1);
  const occasions = days
    .map((day) => ({ day, occasion: OCCASIONS[`${view.month}-${day}`] }))
    .filter((entry) => entry.occasion);

  const firstGreg = jdToGregorian(copticToJd(view.year, view.month, 1));
  const lastGreg = jdToGregorian(copticToJd(view.year, view.month, length));
  const rangeLabel = `يوافق من ${gregorianDayMonth.format(
    new Date(firstGreg.y, firstGreg.m - 1, firstGreg.d),
  )} إلى ${gregorianDayMonth.format(
    new Date(lastGreg.y, lastGreg.m - 1, lastGreg.d),
  )}`;

  const isToday = (day: number) =>
    view.year === today.year && view.month === today.month && day === today.day;

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="التقويم القبطي"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
        />

        <section className="px-6 pt-6">
          <div className="rounded-3xl border border-card-border bg-white p-5 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <p className="text-ink/55 dark:text-night-ink/55 text-center text-xs font-bold">
              النهارده
            </p>
            <p className="text-primary dark:text-rose mt-1 text-center text-2xl font-black">
              {toArabicNumber(today.day)} {COPTIC_MONTHS[today.month - 1]}{" "}
              {toArabicNumber(today.year)} ش
            </p>
          </div>
        </section>

        <section className="px-6 pt-5">
          <div className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="الشهر اللي بعده"
                className="bg-blush dark:bg-night-chip flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95"
              >
                <ChevronLeftIcon className="text-moon dark:text-night-ink h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-ink dark:text-night-ink text-lg font-black">
                  شهر {COPTIC_MONTHS[view.month - 1]}
                </p>
                <p className="text-nav-label dark:text-night-ink/60 text-xs font-bold">
                  {toArabicNumber(view.year)} ش
                </p>
              </div>
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="الشهر اللي فات"
                className="bg-blush dark:bg-night-chip flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95"
              >
                <ChevronRightIcon className="text-moon dark:text-night-ink h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5" dir="rtl">
              {days.map((day) => {
                const occasion = OCCASIONS[`${view.month}-${day}`];
                return (
                  <Link
                    key={day}
                    href={`/calendar/day?y=${view.year}&m=${view.month}&d=${day}`}
                    aria-label={`تفاصيل يوم ${toArabicNumber(day)} ${COPTIC_MONTHS[view.month - 1]}`}
                    className={`flex h-10 items-center justify-center rounded-xl text-sm font-bold transition-transform active:scale-90 ${
                      isToday(day)
                        ? "bg-primary text-white"
                        : occasion
                          ? occasion.kind === "fast"
                            ? "bg-gold-soft text-gold-ink"
                            : "bg-rose-badge text-primary"
                          : "text-ink/70 dark:text-night-ink/70"
                    }`}
                  >
                    {toArabicNumber(day)}
                  </Link>
                );
              })}
            </div>

            <p className="text-nav-label dark:text-night-ink/60 mt-3 text-center text-[11px] leading-4">
              {rangeLabel}
            </p>
          </div>
        </section>

        {occasions.length > 0 && (
          <section className="px-6 pt-5">
            <div className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
              <div className="flex items-center gap-3">
                <span className="icon-badge icon-badge--calendar bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
                  <CalendarIcon className="h-5 w-5" />
                </span>
                <p className="text-ink dark:text-night-ink text-[15px] font-extrabold">
                  مناسبات شهر {COPTIC_MONTHS[view.month - 1]}
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                {occasions.map(({ day, occasion }) => (
                  <li
                    key={day}
                    className="text-ink/70 dark:text-night-ink/70 flex items-center justify-between text-[12px] font-bold"
                  >
                    <span>{occasion.label}</span>
                    <span className="text-nav-label dark:text-night-ink/60 shrink-0 pr-3">
                      {toArabicNumber(day)} {COPTIC_MONTHS[view.month - 1]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-[11px] leading-5">
          الأعياد الثابتة وبدايات الأصوام الثابتة بس اللي معروضة هنا. الأعياد
          المتنقلة زي الصوم الكبير والقيامة والعنصرة بتتغير كل سنة وهتتضاف في
          نسخة جاية.
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
