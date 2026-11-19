"use client";

import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { CapIcon } from "@/shared/ui/icons";

// Study cards follow the concept screen: names and progress are display
// examples only, until real study content from an approved source exists.
const samples = [
  { id: "s1", progress: 72 },
  { id: "s2", progress: 45 },
  { id: "s3", progress: 18 },
];

export default function Studies() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="دراسات الكتاب المقدس"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          دراسات مرتبة للقراءة والتأمل.
        </p>

        <section className="space-y-3 px-6 pt-4">
          {samples.map((study) => (
            <div
              key={study.id}
              className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  قريباً
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    عنوان الدراسة — مثال للعرض
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    عدد الدروس والجزء — مثال
                  </span>
                </span>
                <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center">
                  <CapIcon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-ink/50 dark:text-night-ink/50 shrink-0 text-[11px] font-bold">
                  تقدّمك — مثال
                </span>
                <span className="bg-blush dark:bg-night-chip h-1.5 flex-1 overflow-hidden rounded-full">
                  <span
                    className="bg-primary block h-full rounded-full"
                    style={{ width: `${study.progress}%` }}
                  />
                </span>
              </div>
            </div>
          ))}
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          أسماء الدراسات والأسفار أمثلة للتصميم، مش محتوى فعلي. الدراسات
          هتتضاف بمحتوى معتمد قريباً.
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
