"use client";

import Link from "next/link";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  CardsIcon,
  GridIcon,
  QuestionIcon,
  StairsIcon,
  TargetIcon,
} from "@/shared/ui/icons";

const games = [
  {
    title: "أسئلة سريعة",
    hint: "جاوب قبل انتهاء الوقت",
    Icon: QuestionIcon,
    tone: "pink",
    href: null as string | null,
  },
  {
    title: "كلمات متقاطعة",
    hint: "حل الشبكة بالمعاني",
    Icon: GridIcon,
    tone: "gold",
    href: null,
  },
  {
    title: "ذاكرة الصور",
    hint: "ركّز وافتكر الأماكن",
    Icon: CardsIcon,
    tone: "pink",
    href: "/games/memory",
  },
  {
    title: "تحديات أسبوعية",
    hint: "مسابقات جديدة كل أسبوع",
    Icon: TargetIcon,
    tone: "gold",
    href: null,
  },
];

export default function Games() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="ألعاب ومسابقات"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          تحديات مسيحية ممتعة لكل الأعمار.
        </p>

        <section className="px-6 pt-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] px-6 py-7 dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
            <span className="bg-starburst/40 absolute -top-14 -right-14 h-40 w-40 rounded-full" aria-hidden="true" />
            <span className="bg-starburst/40 absolute -bottom-12 -left-12 h-32 w-32 rounded-full" aria-hidden="true" />
            <div className="relative flex items-center gap-4">
              <div className="flex-1">
                <p className="text-gold-bright text-xl font-black">
                  مسابقة سلّم الأسئلة
                </p>
                <p className="text-subtitle mt-1.5 text-[13px] leading-6">
                  اصعد السلم بإجابات صحيحة ومساعدات محدودة.
                </p>
                <Link
                  href="/games/quiz"
                  className="bg-gold text-primary-deep mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-extrabold transition-transform active:scale-95"
                >
                  استكشف المسابقة
                </Link>
              </div>
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <StairsIcon className="h-8 w-8 text-gold" />
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {games.map(({ title, hint, Icon, tone, href }) => {
              const body = (
                <>
                  <span
                    className={`icon-badge icon-badge--soft-square flex h-11 w-11 items-center justify-center ${
                      tone === "gold"
                        ? "bg-gold-soft text-gold-ink"
                        : "bg-rose-badge text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-ink dark:text-night-ink mt-3 text-[15px] font-extrabold">
                    {title}
                  </p>
                  <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[11px] leading-4">
                    {hint}
                  </p>
                  <p
                    className={`mt-3 rounded-full py-1.5 text-center text-[11px] font-bold ${
                      href
                        ? "bg-primary text-white"
                        : "bg-gold-soft text-gold-ink"
                    }`}
                  >
                    {href ? "العب دلوقتي" : "قريباً"}
                  </p>
                </>
              );
              const className =
                "section-card flex flex-col rounded-3xl border border-card-border bg-white p-4 text-right shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none";
              return href ? (
                <Link
                  key={title}
                  href={href}
                  className={`${className} transition-transform active:scale-[0.98]`}
                >
                  {body}
                </Link>
              ) : (
                <div key={title} className={className}>
                  {body}
                </div>
              );
            })}
          </div>
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          سلّم الأسئلة وذاكرة الصور شغّالين على جهازك دلوقتي، وباقي الألعاب
          هتتفعّل بمحتوى جديد قريباً.
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
