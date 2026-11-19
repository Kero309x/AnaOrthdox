"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isRecord, useStored } from "@/shared/lib/useStored";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  BellIcon,
  BookIcon,
  MoonIcon,
  StarIcon,
} from "@/shared/ui/icons";
import {
  COPTIC_MONTHS,
  OCCASIONS,
  copticMonthLength,
  copticToJd,
  formatCopticDate,
  gregorianToCoptic,
  jdToGregorian,
} from "@/domain/calendar/coptic";

const gregorianFull = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Day detail from the concept screen. The date and any fixed occasion are
// real (computed by the same algorithm as the calendar); readings, fasting
// state and reminders still need a liturgical data source and say so.
const noNotes: Record<string, unknown> = {};

export default function CalendarDay() {
  const { dark, toggleTheme } = useTheme();
  const params = useSearchParams();
  const [notes, setNotes] = useStored("notes.days", noNotes, isRecord);

  const today = gregorianToCoptic(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  );
  const year = params.has("y") ? Number(params.get("y")) : today.year;
  const month = params.has("m") ? Number(params.get("m")) : today.month;
  const day = params.has("d") ? Number(params.get("d")) : today.day;
  const valid = Number.isInteger(year) && year >= 1 && year <= 9999 &&
    Number.isInteger(month) && month >= 1 && month <= 13 &&
    Number.isInteger(day) && day >= 1 && day <= copticMonthLength(year, month);
  if (!valid) return (
    <main className="mx-auto min-h-dvh max-w-md px-6 pb-32">
      <Header title="تاريخ غير صالح" dark={dark} onToggleTheme={toggleTheme} back backHref="/calendar" />
      <p className="pt-6">الرابط فيه تاريخ غير صالح. ارجع للتقويم واختار اليوم من جديد.</p>
      <BottomNav />
    </main>
  );
  const safeMonth = month;

  const greg = jdToGregorian(copticToJd(year, safeMonth, day));
  const gregDate = new Date(greg.y, greg.m - 1, greg.d);
  const occasion = OCCASIONS[`${safeMonth}-${day}`];

  const rows = [
    {
      Icon: StarIcon,
      tone: "gold",
      title: "مناسبة اليوم",
      hint: occasion ? occasion.label : "مفيش مناسبة ثابتة في اليوم ده",
      soon: false,
    },
    {
      Icon: BookIcon,
      tone: "maroon",
      title: "قراءات اليوم",
      hint: "محتاجة مصدر ليتورجي معتمد، هتظهر عند الإطلاق",
      soon: true,
      href: "/readings",
    },
    {
      Icon: MoonIcon,
      tone: "pink",
      title: "حالة الصيام",
      hint: occasion?.kind === "fast"
        ? occasion.label
        : "الأصوام المتنقلة محتاجة مصدر بيانات، هتظهر عند الإطلاق",
      soon: occasion?.kind !== "fast",
    },
    {
      Icon: BellIcon,
      tone: "gold",
      title: "تذكير باليوم",
      hint: "اضبط تذكير التطبيق من الإعدادات",
      soon: false,
      href: "/settings",
    },
  ] as const;

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="تفاصيل اليوم"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/calendar"
        />

        <section className="px-6 pt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] px-6 py-8 dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
            <span className="bg-starburst/40 absolute -top-14 -right-14 h-40 w-40 rounded-full" aria-hidden="true" />
            <div className="relative text-center">
              <p className="text-gold-bright text-2xl font-black">
                {formatCopticDate({ year, month: safeMonth, day })}
              </p>
              <p className="text-subtitle mt-2 text-[13px] leading-6">
                {gregorianFull.format(gregDate)}
              </p>
              <p className="text-subtitle mt-1 text-[11px]">
                شهر {COPTIC_MONTHS[safeMonth - 1]} في سنة الشهداء
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 px-6 pt-5">
          {rows.map(({ Icon, tone, title, hint, soon, ...rest }) => {
            const href = "href" in rest ? (rest as { href: string }).href : undefined;
            const Wrap = ({ children }: { children: React.ReactNode }) => href ? <Link href={href} className="block transition-transform active:scale-[0.99]">{children}</Link> : <>{children}</>;
            return (
            <Wrap key={title}>
            <div
              className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
            >
              {soon && (
                <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  المصدر غير متصل
                </span>
              )}
              <span className="flex-1 text-right">
                <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                  {title}
                </span>
                <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                  {hint}
                </span>
              </span>
              <span
                className={`icon-badge icon-badge--soft-square flex h-10 w-10 shrink-0 items-center justify-center ${
                  tone === "maroon"
                    ? "bg-primary text-white"
                    : tone === "pink"
                      ? "bg-rose-badge text-primary"
                      : "bg-gold-soft text-gold-ink"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            </Wrap>
            );
          })}
          <div className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <label htmlFor="day-note" className="text-ink dark:text-night-ink block text-right text-[15px] font-extrabold">ملاحظتك على اليوم ده</label>
            <textarea id="day-note" maxLength={500} value={typeof notes[`${year}-${safeMonth}-${day}`] === "string" ? (notes[`${year}-${safeMonth}-${day}`] as string) : ""} onChange={(e) => setNotes((p) => ({ ...p, [`${year}-${safeMonth}-${day}`]: e.target.value }))} placeholder="اكتب موعد أو تذكرة تخصك" className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink mt-2 h-20 w-full resize-none rounded-2xl p-3 text-[13px] outline-none" />
            <p className="text-ink/50 dark:text-night-ink/50 mt-1 text-[11px]">بتتحفظ على جهازك فقط.</p>
          </div>
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
