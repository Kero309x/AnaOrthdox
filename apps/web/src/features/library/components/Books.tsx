"use client";

import { useState } from "react";
import { BottomNav, Header, Toast, useTheme, useToast } from "@/shared/ui/chrome";
import { DownloadIcon, OpenBookIcon } from "@/shared/ui/icons";

const filters = [
  { id: "all", label: "الكل" },
  { id: "popular", label: "الأكثر قراءة" },
  { id: "downloaded", label: "المحمّلة" },
] as const;

type FilterId = (typeof filters)[number]["id"];

// Covers, titles and authors are display examples from the concept screen,
// not real books, until a licensed library is connected.
const samples = [
  { id: "b1", dark: false, popular: true },
  { id: "b2", dark: true, popular: true },
  { id: "b3", dark: false, popular: false },
  { id: "b4", dark: true, popular: false },
];

export default function Books() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = samples.filter(
    (book) => filter === "all" || (filter === "popular" && book.popular),
  );

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="مكتبة الكتب"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          اقرأ أونلاين أو حمّل على موبايلك.
        </p>

        <section className="px-6 pt-4">
          <div className="flex gap-2.5">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  filter === item.id
                    ? "bg-primary text-white"
                    : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 pt-4">
          {filter === "downloaded" ? (
            <div className="rounded-3xl border border-card-border bg-white p-6 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
              <span className="icon-badge icon-badge--pebble bg-gold-soft text-gold-ink mx-auto flex h-12 w-12 items-center justify-center">
                <DownloadIcon className="h-6 w-6" />
              </span>
              <p className="text-ink dark:text-night-ink mt-3 text-[15px] font-extrabold">
                لسه مفيش كتب محمّلة على جهازك
              </p>
              <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-5">
                لما المكتبة تتفعّل، هتقدر تحمّل الكتب وتقراها من غير نت.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {visible.map((book) => (
                <div
                  key={book.id}
                  className="rounded-3xl border border-card-border bg-white p-3 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
                >
                  <div
                    className={`flex h-32 items-center justify-center rounded-2xl ${
                      book.dark
                        ? "bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-3)_100%)]"
                        : "bg-rose"
                    }`}
                  >
                    <OpenBookIcon
                      className={`h-9 w-9 ${book.dark ? "text-gold" : "text-primary"}`}
                    />
                  </div>
                  <p className="text-ink dark:text-night-ink mt-3 text-right text-[14px] font-extrabold">
                    عنوان الكتاب — مثال
                  </p>
                  <p className="text-ink/55 dark:text-night-ink/55 mt-0.5 text-right text-[11px] leading-4">
                    اسم الكاتب — مثال
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        showToast("القراءة هتتفعّل مع مكتبة الكتب، قريباً")
                      }
                      className="bg-primary flex-1 rounded-full py-2 text-[13px] font-bold text-white transition-transform active:scale-95"
                    >
                      اقرأ
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        showToast("التحميل هيتفعّل مع مكتبة الكتب، قريباً")
                      }
                      aria-label="تحميل الكتاب"
                      className="bg-gold-badge text-gold-ink flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="bg-gold-soft text-gold-ink mt-2.5 rounded-full py-1 text-center text-[11px] font-bold">
                    قريباً
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          العناوين المعروضة أمثلة للتصميم. التحميل للكتب المتاحة للنشر
          والتوزيع فقط.
        </p>

        <BottomNav />
        <Toast message={toast} />
      </main>
    </div>
  );
}
