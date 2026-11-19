"use client";

import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  BalloonIcon,
  GridIcon,
  MusicIcon,
  OpenBookIcon,
  PaletteDrawIcon,
} from "@/shared/ui/icons";

const rows = [
  {
    title: "قصص",
    hint: "قصص مبسطة بأسلوب محبب",
    Icon: OpenBookIcon,
    tone: "gold",
  },
  {
    title: "ترانيم أطفال",
    hint: "ألحان سهلة وفرحة",
    Icon: MusicIcon,
    tone: "pink",
  },
  {
    title: "أنشطة وتلوين",
    hint: "وقت مفيد وممتع",
    Icon: PaletteDrawIcon,
    tone: "gold",
  },
  {
    title: "ألعاب بسيطة",
    hint: "لعب آمن من غير مشتريات",
    Icon: GridIcon,
    tone: "pink",
  },
] as const;

export default function Kids() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="ركن الأطفال"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          قسم خاص بالأطفال.
        </p>

        <section className="px-6 pt-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,#c98a2b_0%,#b1761c_50%,#96620f_100%)] px-6 py-8">
            <span className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10" aria-hidden="true" />
            <span className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <BalloonIcon className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-xl font-black text-white">
                  مكان آمن وفرحان لأولادنا
                </p>
                <p className="mt-1 text-[13px] leading-6 text-white/85">
                  قصص وألحان وأنشطة مناسبة لكل سن.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 px-6 pt-4">
          {rows.map(({ title, hint, Icon, tone }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
            >
              <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                قريباً
              </span>
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
                  tone === "gold"
                    ? "bg-gold-soft text-gold-ink"
                    : "bg-rose-badge text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          ))}
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          من غير إعلانات ولا مشتريات، ومحتوى مناسب للأطفال. المحتوى هيتضاف
          بمصادر موثوقة قريباً.
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
