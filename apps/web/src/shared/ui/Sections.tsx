"use client";

import Link from "next/link";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  BalloonIcon,
  BookIcon,
  CalendarIcon,
  CapIcon,
  ChurchIcon,
  CompassIcon,
  CrossIcon,
  MusicIcon,
  OpenBookIcon,
  StairsIcon,
  VideoIcon,
} from "@/shared/ui/icons";

type Section = {
  title: string;
  href: string;
  isNew: boolean;
  shape: "circle" | "pebble" | "soft-square" | "calendar";
  Icon: (props: { className?: string }) => React.JSX.Element;
};

// Every section of the app in one grid, following the sections concept
// screen: the four original sections plus the seven added later, which
// carry the "جديد" pill from the same design.
const sections: Section[] = [
  { title: "الصلوات", href: "/prayers", isNew: false, shape: "pebble", Icon: CrossIcon },
  { title: "قراءة اليوم", href: "/readings", isNew: false, shape: "circle", Icon: BookIcon },
  { title: "التقويم القبطي", href: "/calendar", isNew: false, shape: "calendar", Icon: CalendarIcon },
  { title: "الكنائس", href: "/churches", isNew: false, shape: "soft-square", Icon: ChurchIcon },
  { title: "ترانيم وألحان", href: "/audio", isNew: true, shape: "pebble", Icon: MusicIcon },
  { title: "فيديوهات", href: "/videos", isNew: true, shape: "soft-square", Icon: VideoIcon },
  { title: "دراسات الكتاب المقدس", href: "/studies", isNew: true, shape: "circle", Icon: CapIcon },
  { title: "مكتبة الكتب", href: "/books", isNew: true, shape: "soft-square", Icon: OpenBookIcon },
  { title: "ركن الأطفال", href: "/kids", isNew: true, shape: "pebble", Icon: BalloonIcon },
  { title: "ألعاب ومسابقات", href: "/games", isNew: true, shape: "calendar", Icon: StairsIcon },
  { title: "البوصلة", href: "/compass", isNew: true, shape: "circle", Icon: CompassIcon },
];

export default function Sections() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="كل الأقسام"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          تنقل سهل بين أقسام التطبيق.
        </p>

        <section className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-3">
            {sections.map(({ title, href, isNew, shape, Icon }) => (
              <Link
                key={title}
                href={href}
                className="section-card flex flex-col items-center rounded-3xl border border-card-border bg-white p-3 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] transition-transform active:scale-[0.97] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
              >
                <span
                  className={`icon-badge icon-badge--${shape} flex h-11 w-11 items-center justify-center ${
                    isNew
                      ? "bg-gold-soft text-gold-ink"
                      : "bg-rose-badge text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-ink dark:text-night-ink mt-2.5 text-[13px] leading-4 font-extrabold">
                  {title}
                </p>
                {isNew && (
                  <span className="bg-gold-badge text-gold-ink mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                    جديد
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
