"use client";

import { useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { PlayIcon } from "@/shared/ui/icons";

type Clip = { id: string; kind: "ezat" | "taranem" };

const filters = [
  { id: "all", label: "الكل" },
  { id: "ezat", label: "عظات واجتماعات" },
  { id: "taranem", label: "ترانيم مصوّرة" },
] as const;

type FilterId = (typeof filters)[number]["id"];

// Placeholder cards from the concept screen; the filter chips genuinely
// filter the sample list, and cards carry the "قريباً" state until a real
// video source is connected.
const samples: Clip[] = [
  { id: "v1", kind: "ezat" },
  { id: "v2", kind: "taranem" },
  { id: "v3", kind: "ezat" },
];

export default function Videos() {
  const { dark, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = samples.filter(
    (clip) => filter === "all" || clip.kind === filter,
  );

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="فيديوهات"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          شاهد في أي وقت.
        </p>

        <section className="px-6 pt-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors ${
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

        <section className="space-y-4 px-6 pt-4">
          {visible.map((clip) => (
            <div
              key={clip.id}
              className="overflow-hidden rounded-3xl border border-card-border bg-white shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
            >
              <div className="relative h-44 bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
                <span className="bg-starburst/40 absolute -top-14 -right-14 h-40 w-40 rounded-full" aria-hidden="true" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gold text-gold-ink flex h-14 w-14 items-center justify-center rounded-full">
                    <PlayIcon className="h-6 w-6" />
                  </span>
                </span>
                <span className="bg-primary-deep/80 absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white" dir="ltr">
                  --:--
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  قريباً
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    عنوان الفيديو — مثال للعرض
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    {clip.kind === "ezat" ? "عظات واجتماعات" : "ترانيم مصوّرة"} — مثال
                  </span>
                </span>
              </div>
            </div>
          ))}
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          المعروض أمثلة للتصميم، ومكتبة الفيديو هتتضاف بمصادر معتمدة قريباً.
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
