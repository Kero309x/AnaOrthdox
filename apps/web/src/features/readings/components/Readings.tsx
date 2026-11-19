"use client";

import Link from "next/link";
import { BottomNav, Header, SectionTitle, useTheme } from "@/shared/ui/chrome";
import {
  COPTIC_MONTHS,
  formatCopticDate,
  gregorianToCoptic,
} from "@/domain/calendar/coptic";
import { BookIcon, ChevronLeftIcon } from "@/shared/ui/icons";
import { READING_SLOTS } from "@/domain/readings/slots";

export default function Readings() {
  const { dark, toggleTheme } = useTheme();

  const now = new Date();
  const coptic = gregorianToCoptic(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  const gregorianLabel = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="قراءة اليوم"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
        />

        <section className="px-6 pt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] px-6 py-7 dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
            <div className="relative">
              <p className="text-subtitle text-sm font-bold">{gregorianLabel}</p>
              <p className="mt-2 text-2xl font-black text-white">
                {formatCopticDate(coptic)}
              </p>
              <p className="text-subtitle mt-1 text-xs leading-5">
                شهر {COPTIC_MONTHS[coptic.month - 1]} في سنة الشهداء
              </p>
            </div>
          </div>
        </section>

        <section className="px-6">
          <SectionTitle>ترتيب قراءات القداس</SectionTitle>
          <div className="divide-divider dark:divide-divider-dark rounded-3xl border border-card-border bg-white shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            {READING_SLOTS.map((slot) => (
              <Link
                key={slot.id}
                href={`/readings/${slot.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-blush/60 dark:active:bg-night-chip/40"
              >
                <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center">
                  <BookIcon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    {slot.name}
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    {slot.hint}
                  </span>
                </span>
                <ChevronLeftIcon className="text-nav-label h-4 w-4" />
              </Link>
            ))}
          </div>
          <p className="text-ink/50 dark:text-night-ink/50 px-2 pt-2 text-[11px] leading-5">
            افتح أي قسم لشاشة القراءة: التاريخ والتنقل وحجم الخط شغّالين،
            والنصوص نفسها محتاجة مصدر ليتورجي معتمد فهتتوفر في نسخة جاية.
          </p>
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
