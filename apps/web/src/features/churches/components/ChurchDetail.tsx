"use client";


import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomNav, Header, Toast, useTheme, useToast } from "@/shared/ui/chrome";
import {
  BellIcon,
  ChurchIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
} from "@/shared/ui/icons";

import type { FavoriteChurch } from "@/data/contracts";
import { churchFavorites } from "@/data/local";

// The church detail screen works with the user's own locally-saved
// favorites: the name and area they typed are real, while address,
// liturgy times and contact data stay marked as pending a real directory.
export default function ChurchDetail() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [church, setChurch] = useState<FavoriteChurch | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChurch(churchFavorites.list().find((item) => item.id === params.id) ?? null);
    setLoaded(true);
  }, [params.id]);

  function removeChurch() {
    const saved = churchFavorites.save(churchFavorites.list().filter((item) => item.id !== params.id));
    if (!saved) { showToast("مش قادر أحفظ التغيير على الجهاز"); return; }
    router.push("/churches");
  }

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="تفاصيل الكنيسة"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/churches"
        />

        {loaded && !church && (
          <section className="px-6 pt-6">
            <div className="rounded-3xl border border-card-border bg-white p-6 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
              <p className="text-ink dark:text-night-ink text-[15px] font-extrabold">
                الكنيسة دي مش موجودة في مفضلتك
              </p>
              <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-5">
                ممكن تضيفها من صفحة الكنائس، وهتظهر تفاصيلها هنا.
              </p>
              <Link
                href="/churches"
                className="bg-primary mt-4 inline-block rounded-full px-8 py-3 text-sm font-extrabold text-white transition-transform active:scale-95"
              >
                رجوع للكنائس
              </Link>
            </div>
          </section>
        )}

        {church && (
          <>
            <section className="px-6 pt-6">
              <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] px-6 py-9 dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
                <span className="bg-starburst/40 absolute -top-14 -right-14 h-40 w-40 rounded-full" aria-hidden="true" />
                <div className="relative flex flex-col items-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                    <ChurchIcon className="h-8 w-8 text-white" />
                  </span>
                  <p className="mt-3 text-xl font-black text-white">
                    {church.name}
                  </p>
                  {church.area && (
                    <p className="text-subtitle mt-1 text-[13px]">
                      {church.area}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-3 px-6 pt-5">
              <div className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    العنوان
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    {church.area || "لسه مش مضاف"}
                  </span>
                </span>
                <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
                  <MapPinIcon className="h-5 w-5" />
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
                <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  قريباً
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    مواعيد القداسات
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    المواعيد هتظهر هنا مع دليل الكنائس
                  </span>
                </span>
                <span className="icon-badge icon-badge--soft-square bg-primary flex h-10 w-10 shrink-0 items-center justify-center text-white">
                  <ClockIcon className="h-5 w-5" />
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
                <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                  قريباً
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    وسائل التواصل
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    بيانات التواصل هتظهر هنا مع دليل الكنائس
                  </span>
                </span>
                <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center">
                  <BellIcon className="h-5 w-5" />
                </span>
              </div>
            </section>

            <section className="px-6 pt-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    showToast("الاتجاهات محتاجة دليل كنائس بعناوين، قريباً")
                  }
                  className="bg-gold text-gold-ink flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold transition-transform active:scale-95"
                >
                  <MapPinIcon className="h-4 w-4" />
                  الاتجاهات
                </button>
                <button
                  type="button"
                  onClick={removeChurch}
                  className="border-primary text-primary dark:text-rose flex flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] py-3 text-sm font-extrabold transition-transform active:scale-95"
                >
                  <TrashIcon className="h-4 w-4" />
                  شيل من المفضلة
                </button>
              </div>
            </section>
          </>
        )}

        <BottomNav />
        <Toast message={toast} />
      </main>
    </div>
  );
}
