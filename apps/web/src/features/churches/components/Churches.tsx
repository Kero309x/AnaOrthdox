"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BottomNav,
  Card,
  Header,
  SectionTitle,
  Toast,
  useTheme,
  useToast,
} from "@/shared/ui/chrome";
import { ChevronLeftIcon, ChurchIcon, MapPinIcon, PlusIcon, TrashIcon } from "@/shared/ui/icons";

import type { FavoriteChurch } from "@/data/contracts";
import { churchFavorites } from "@/data/local";

// Favorites are a local list the user writes themselves; no church directory
// or location data is shipped, and the nearby-search note says exactly that.
export default function Churches() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteChurch[]>([]);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFavorites(churchFavorites.list());
    setLoaded(true);
  }, []);

  function persist(next: FavoriteChurch[]) {
    if (!churchFavorites.save(next)) { showToast("مش قادر أحفظ على الجهاز. راجع إعدادات المتصفح"); return false; }
    setFavorites(next); return true;
  }

  function addChurch() {
    const trimmed = name.trim().slice(0, 60);
    if (!trimmed) return;
    const saved = persist([
      { id: crypto.randomUUID(), name: trimmed, area: area.trim().slice(0, 60) },
      ...favorites,
    ]);
    if (!saved) return;
    setName("");
    setArea("");
    showToast("اتحفظت الكنيسة على جهازك");
  }

  function removeChurch(id: string) {
    persist(favorites.filter((church) => church.id !== id));
  }

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="الكنائس"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
        />

        <section className="px-6 pt-6">
          <div className="rounded-3xl border border-card-border bg-white p-5 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink mx-auto flex h-14 w-14 items-center justify-center">
              <MapPinIcon className="h-7 w-7" />
            </span>
            <p className="text-ink dark:text-night-ink mt-3 text-base font-extrabold">
              البحث عن أقرب كنيسة
            </p>
            <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-5">
              محتاج قاعدة بيانات بعناوين الكنائس ومواعيد القداسات، وهتتوفر في
              نسخة جاية.
            </p>
          </div>
        </section>

        <section className="px-6">
          <SectionTitle>كنائسك المفضلة</SectionTitle>
          <div className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addChurch();
              }}
              maxLength={60}
              placeholder="اسم الكنيسة"
              aria-label="اسم الكنيسة"
              className="border-rose text-ink dark:bg-night-chip dark:text-night-ink w-full rounded-xl border-[1.5px] bg-white px-3 py-3.5 text-sm font-bold outline-none focus-visible:border-primary dark:border-card-border-dark"
            />
            <input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addChurch();
              }}
              maxLength={60}
              placeholder="المنطقة (اختياري)"
              aria-label="المنطقة"
              className="border-rose text-ink dark:bg-night-chip dark:text-night-ink mt-2.5 w-full rounded-xl border-[1.5px] bg-white px-3 py-3.5 text-sm font-bold outline-none focus-visible:border-primary dark:border-card-border-dark"
            />
            <button
              type="button"
              onClick={addChurch}
              disabled={!name.trim()}
              className="bg-primary mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-40"
            >
              <PlusIcon className="h-4 w-4" />
              إضافة للمفضلة
            </button>
            <p className="text-ink/50 dark:text-night-ink/50 mt-2 text-center text-[11px] leading-4">
              القايمة دي بتتحفظ على جهازك بس.
            </p>
          </div>

          {loaded && favorites.length > 0 && (
            <div className="mt-4">
              <Card>
                {favorites.map((church) => (
                  <div
                    key={church.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/churches/${church.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") router.push(`/churches/${church.id}`);
                    }}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors active:bg-blush/60 dark:active:bg-night-chip/40"
                  >
                    <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
                      <ChurchIcon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-right">
                      <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                        {church.name}
                      </span>
                      {church.area && (
                        <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                          {church.area}
                        </span>
                      )}
                    </span>
                    <ChevronLeftIcon className="text-nav-label h-4 w-4 shrink-0" />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeChurch(church.id);
                      }}
                      aria-label={`حذف ${church.name}`}
                      className="bg-rose-badge text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </section>

        <BottomNav />
        <Toast message={toast} />
      </main>
    </div>
  );
}
