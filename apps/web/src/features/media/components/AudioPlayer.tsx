"use client";

import { useSearchParams } from "next/navigation";
import { BottomNav, Header, Toast, useTheme, useToast } from "@/shared/ui/chrome";
import {
  DownloadIcon,
  HeartIcon,
  MusicIcon,
  PlayIcon,
  SkipBackIcon,
  SkipNextIcon,
} from "@/shared/ui/icons";

// The player shell from the concept screen. There is no audio library yet,
// so playback and download stay honest "coming soon" actions and the
// progress bar stays empty instead of simulating a track.
export default function AudioPlayer() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const params = useSearchParams();
  const kind = params.get("kind") === "alhan" ? "alhan" : "taranem";

  const title = kind === "alhan" ? "اسم اللحن — مثال للعرض" : "اسم الترنيمة — مثال للعرض";

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="المشغّل"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/audio"
        />

        <section className="px-6 pt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
            <span className="bg-starburst/40 absolute -top-16 -right-16 h-44 w-44 rounded-full" aria-hidden="true" />
            <span className="bg-starburst/40 absolute -bottom-14 -left-14 h-36 w-36 rounded-full" aria-hidden="true" />
            <div className="relative flex h-52 items-center justify-center">
              <span className="bg-white/15 flex h-20 w-20 items-center justify-center rounded-full">
                <MusicIcon className="h-9 w-9 text-white" />
              </span>
            </div>
          </div>

          <div className="pt-5 text-center">
            <p className="text-ink dark:text-night-ink text-xl font-black">
              {title}
            </p>
            <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px]">
              اسم الفريق أو المرنم — مثال للعرض
            </p>
          </div>

          {/* Progress: static until a real track can play. */}
          <div className="pt-6">
            <div className="bg-blush dark:bg-night-chip relative h-2 rounded-full">
              <span className="bg-primary absolute top-1/2 right-0 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white shadow dark:border-night-card" />
            </div>
            <div className="text-nav-label dark:text-night-ink/60 mt-2 flex justify-between text-[11px] font-bold" dir="ltr">
              <span>--:--</span>
              <span>--:--</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-5">
            <button
              type="button"
              disabled
              aria-label="السابق"
              className="bg-rose-badge text-primary flex h-12 w-12 items-center justify-center rounded-full opacity-40"
            >
              <SkipBackIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                showToast("المشغّل هيشتغل لما مكتبة الصوتيات تتجهز، قريباً")
              }
              aria-label="تشغيل"
              className="bg-primary flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95"
            >
              <PlayIcon className="h-7 w-7" />
            </button>
            <button
              type="button"
              disabled
              aria-label="التالي"
              className="bg-rose-badge text-primary flex h-12 w-12 items-center justify-center rounded-full opacity-40"
            >
              <SkipNextIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-6">
            <span
              aria-label="إضافة للمفضلة غير متاحة حالياً"
              className="bg-rose-badge text-primary flex h-12 w-12 items-center justify-center rounded-full opacity-40"
            >
              <HeartIcon className="h-5 w-5" />
            </span>
            <span
              aria-label="التنزيل غير متاح حالياً"
              className="bg-gold-soft text-gold-ink flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold"
            >
              <DownloadIcon className="h-4 w-4" />
              التنزيل قريباً
            </span>
          </div>
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-6 text-center text-[11px] leading-5">
          شكل المشغّل والتنزيل تصور مقترح — قريباً.
        </p>

        <BottomNav />
        <Toast message={toast} />
      </main>
    </div>
  );
}
