"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  BookIcon,
  CrossIcon,
  ChurchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  SectionsIcon,
} from "@/shared/ui/icons";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";

type SectionCard = {
  title: string;
  description: string;
  href: string;
  tone: "amber" | "pink";
  shape: "circle" | "pebble" | "soft-square" | "calendar";
  Icon: (props: { className?: string }) => React.JSX.Element;
};

// Visual order matches the design source: top-right reading, top-left prayers,
// bottom-right calendar, bottom-left churches (RTL grid fills right first).
const sections: SectionCard[] = [
  {
    title: "قراءة اليوم",
    description: "قراءات القداس والأجبية يومياً",
    href: "/readings",
    tone: "pink",
    shape: "circle",
    Icon: BookIcon,
  },
  {
    title: "الصلوات",
    description: "الأجبية والمزامير كاملة",
    href: "/prayers",
    tone: "amber",
    shape: "pebble",
    Icon: CrossIcon,
  },
  {
    title: "التقويم القبطي",
    description: "الأعياد والأصوام طوال السنة",
    href: "/calendar",
    tone: "pink",
    shape: "calendar",
    Icon: CalendarIcon,
  },
  {
    title: "الكنائس",
    description: "أقرب كنيسة ومواعيد القداس",
    href: "/churches",
    tone: "amber",
    shape: "soft-square",
    Icon: ChurchIcon,
  },
];

const chips = [
  { label: "صلاة الصباح", href: "/prayers#baaker" },
  { label: "العشية", href: "/prayers#ghoroub" },
  { label: "تسبحة", href: "/prayers#tasbeha" },
];

export default function Home() {
  const { dark, toggleTheme } = useTheme();
  const sectionsRef = useRef<HTMLElement | null>(null);

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        {/* Header */}
        <Header title="أنا أرثوذكسي" dark={dark} onToggleTheme={toggleTheme} />

        {/* Hero */}
        <section className="px-6 pt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] px-6 py-9 dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
            {/* decorative starbursts, lighter mauve like the design source */}
            <svg
              viewBox="0 0 360 280"
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <polygon
                points="40.0,-82.0 79.4,-45.2 133.3,-43.3 135.2,10.6 172.0,50.0 135.2,89.4 133.3,143.3 79.4,145.2 40.0,182.0 0.6,145.2 -53.3,143.3 -55.2,89.4 -92.0,50.0 -55.2,10.6 -53.3,-43.3 0.6,-45.2"
                fill="var(--starburst)"
              />
              <polygon
                points="75.0,190.0 89.9,204.0 110.4,204.6 111.0,225.1 125.0,240.0 111.0,254.9 110.4,275.4 89.9,276.0 75.0,290.0 60.1,276.0 39.6,275.4 39.0,254.9 25.0,240.0 39.0,225.1 39.6,204.6 60.1,204.0"
                fill="var(--starburst)"
              />
            </svg>

            <div className="relative">
              <p className="text-3xl leading-snug font-black text-white">
                بيتك الروحي،
                <br />
                <span className="text-gold-bright">كله في مكان واحد</span>
              </p>
              <p className="text-subtitle mt-4 text-sm leading-7">
                صلواتك وقراءاتك اليومية وأخبار الكنيسة وتقويمها القبطي، مصمّمة
                ليك بكل حب.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/readings"
                  className="bg-gold text-primary-deep flex flex-row-reverse items-center gap-2 rounded-full px-6 py-3 text-base font-extrabold transition-transform active:scale-95"
                >
                  قراءة اليوم
                  <BookIcon className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    sectionsRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-full border-[1.5px] border-white/80 px-6 py-3 text-base font-bold text-white transition-transform active:scale-95"
                >
                  استكشف
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Prayer shortcuts */}
        <section className="px-6 pt-3">
          <div className="flex flex-wrap gap-2.5">
            {chips.map((chip, i) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`min-w-fit rounded-full py-3.5 text-center text-sm font-bold transition-colors ${
                  i === 0
                    ? "bg-primary flex-1 text-white"
                    : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink px-6"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </section>

        {/* App sections */}
        <section ref={sectionsRef} className="px-6 pt-8">
          <div className="flex items-end justify-between">
            <h2 className="text-ink dark:text-night-ink text-2xl font-black">
              أقسام التطبيق
            </h2>
            <Link
              href="/sections"
              className="text-primary dark:text-rose text-sm font-bold"
            >
              شوف كل الأقسام
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {sections.map(({ title, description, href, tone, shape, Icon }) => (
              <Link
                key={title}
                href={href}
                className="section-card flex flex-col dark:bg-night-card rounded-3xl border border-card-border bg-white p-4 text-right shadow-[0_2px_12px_rgba(73,41,46,0.05)] transition-transform active:scale-[0.98] dark:shadow-none"
              >
                <span
                  className={`icon-badge icon-badge--${shape} flex h-11 w-11 items-center justify-center ${
                    tone === "amber"
                      ? "bg-gold-soft text-gold-ink"
                      : "bg-rose-badge text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-ink dark:text-night-ink mt-4 text-lg font-extrabold">
                  {title}
                </p>
                <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[11px] leading-[18px]">
                  {description}
                </p>
              </Link>
            ))}
          </div>

          {/* All-sections hub: the four above plus the seven newer sections. */}
          <Link
            href="/sections"
            className="mt-4 flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] transition-transform active:scale-[0.99] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
          >
            <span className="icon-badge icon-badge--pebble bg-gold-soft text-gold-ink flex h-11 w-11 shrink-0 items-center justify-center">
              <SectionsIcon className="h-5 w-5" />
            </span>
            <span className="flex-1 text-right">
              <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                كل الأقسام
              </span>
              <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                ١١ قسم: ترانيم وألحان وفيديوهات ودراسات وكتب وركن أطفال وألعاب والبوصلة
              </span>
            </span>
            <ChevronLeftIcon className="text-nav-label h-4 w-4" />
          </Link>
        </section>

        {/* Bottom navigation */}
        <BottomNav active="home" />
      </main>
    </div>
  );
}
