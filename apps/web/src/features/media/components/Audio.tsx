"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNav, Header, Toast, useTheme, useToast } from "@/shared/ui/chrome";
import { DownloadIcon, MusicIcon } from "@/shared/ui/icons";

type Track = { id: string; kind: "taranem" | "alhan" };

const filters = [
  { id: "all", label: "الكل" },
  { id: "taranem", label: "ترانيم" },
  { id: "alhan", label: "ألحان" },
  { id: "downloaded", label: "المحمّلة" },
] as const;

type FilterId = (typeof filters)[number]["id"];

// Sample rows stand in for the audio library exactly like the concept
// screen: marked as display examples until a licensed library is added.
const samples: Track[] = [
  { id: "t1", kind: "taranem" },
  { id: "h1", kind: "alhan" },
  { id: "t2", kind: "taranem" },
  { id: "h2", kind: "alhan" },
  { id: "t3", kind: "taranem" },
];

export default function Audio() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = samples.filter(
    (track) => filter === "all" || track.kind === filter,
  );

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="ترانيم وألحان"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          اسمع MP3 أو حمّل للاستماع من غير نت.
        </p>

        <section className="px-6 pt-4">
          <div className="flex flex-wrap gap-2.5">
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
                لسه مفيش حاجة محمّلة على جهازك
              </p>
              <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-5">
                لما مكتبة الترانيم تتفعّل، التنزيل هيشتغل من هنا للاستماع من
                غير نت.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((track) => (
                <div
                  key={track.id}
                  role="link"
                  tabIndex={0}
                  onClick={() =>
                    router.push(
                      `/audio/player?kind=${track.kind}`,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter")
                      router.push(`/audio/player?kind=${track.kind}`);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] transition-transform active:scale-[0.99] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
                >
                  <span
                    className={`icon-badge icon-badge--soft-square flex h-11 w-11 shrink-0 items-center justify-center ${
                      track.kind === "taranem"
                        ? "bg-rose-badge text-primary"
                        : "bg-gold-soft text-gold-ink"
                    }`}
                  >
                    <MusicIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-right">
                    <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                      {track.kind === "taranem"
                        ? "اسم الترنيمة — مثال للعرض"
                        : "اسم اللحن — مثال للعرض"}
                    </span>
                    <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                      اسم الفريق أو المرنم — مثال
                    </span>
                  </span>
                  <span
                    aria-label="التنزيل غير متاح حالياً"
                    className="bg-gold-soft text-gold-ink flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-extrabold"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    قريباً
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          المعروض أمثلة للتصميم، ومكتبة الترانيم والألحان هتتضاف بمحتوى مرخّص
          قريباً. التنزيل متاح للمحتوى المسموح بنشره وتوزيعه فقط.
        </p>

        <BottomNav />
        <Toast message={toast} />
      </main>
    </div>
  );
}
