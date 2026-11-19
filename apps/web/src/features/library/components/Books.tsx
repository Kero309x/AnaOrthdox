"use client";

import Link from "next/link";
import { useState } from "react";
import { books } from "@/data/catalog";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { Chips, FilterBar, ToggleChip, DemoBadge, DemoNote, EmptyState, FavButton, ProgressBar, Screen, cardCls, DemoSource } from "@/shared/ui/kit";
import { DownloadIcon, HeartIcon, OpenBookIcon } from "@/shared/ui/icons";

const filters = [
  { id: "all", label: "الكل" },
  { id: "popular", label: "الأكثر قراءة" },
] as const;
type FilterId = (typeof filters)[number]["id"];
const none: string[] = [];
const noRec: Record<string, unknown> = {};

export default function Books() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);
  const [favs, setFavs] = useStored("fav.book", none, isStringArray);
  const [downloaded] = useStored("downloaded.book", none, isStringArray);
  const [pagesAt] = useStored("page.book", noRec, isRecord);

  const visible = books.filter((b) => {
    if (onlyFav && !favs.includes(b.id)) return false;
    if (onlyDownloaded && !downloaded.includes(b.id)) return false;
    return filter === "all" || b.popular;
  });

  return (
    <Screen title="مكتبة الكتب" backHref="/sections" intro="اقرأ أونلاين أو احفظ كتبك على موبايلك.">
      <FilterBar toggles={<><ToggleChip label="المفضلة" on={onlyFav} onChange={setOnlyFav} /><ToggleChip label="المحمّلة" on={onlyDownloaded} onChange={setOnlyDownloaded} /></>}><Chips items={filters} value={filter} onChange={setFilter} /></FilterBar>
<DemoSource label="الكتب">
      <section className="px-6 pt-4">
        {visible.length === 0 ? (
          onlyFav ? (
            <EmptyState icon={<HeartIcon className="h-6 w-6" />} title="مفيش كتب مفضلة" hint="اضغط القلب على أي كتاب لحفظه هنا." />
          ) : (
            <EmptyState icon={<DownloadIcon className="h-6 w-6" />} title="لسه مفيش كتب محمّلة على جهازك" hint="افتح أي كتاب واضغط تنزيل، وهيظهر هنا." />
          )
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {visible.map((book) => {
              const at = typeof pagesAt[book.id] === "number" ? (pagesAt[book.id] as number) : 0;
              return (
                <div key={book.id} className={`${cardCls} p-3`}>
                  <Link href={`/books/read?id=${book.id}`} aria-label={`افتح ${book.title}`} className={`flex h-32 items-center justify-center rounded-2xl ${book.dark ? "bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-3)_100%)]" : "bg-rose"}`}>
                    <OpenBookIcon className={`h-9 w-9 ${book.dark ? "text-gold" : "text-primary"}`} />
                  </Link>
                  <p className="text-ink dark:text-night-ink mt-3 text-right text-[14px] font-extrabold">{book.title}</p>
                  <p className="text-ink/55 dark:text-night-ink/55 mt-0.5 text-right text-[11px] leading-4">{book.author}</p>
                  {at > 0 && <div className="pt-2"><ProgressBar value={((at + 1) / book.pages.length) * 100} /></div>}
                  <div className="mt-3 flex items-center gap-2">
                    <Link href={`/books/read?id=${book.id}`} className="bg-primary flex-1 rounded-full py-2 text-center text-[13px] font-bold text-white transition-transform active:scale-95">{at > 0 ? "كمّل" : "اقرأ"}</Link>
                    <FavButton active={favs.includes(book.id)} onToggle={() => setFavs((p) => (p.includes(book.id) ? p.filter((x) => x !== book.id) : [...p, book.id]))} label={book.title} />
                  </div>
                  <div className="mt-2.5 flex justify-center gap-1.5"><DemoBadge />{downloaded.includes(book.id) && <span className="bg-rose-badge text-primary rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">محمّل</span>}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>
</DemoSource>
      <DemoNote>الكتب الحالية عينات تجريبية لعرض القراءة والتنزيل. التنزيل للكتب المتاحة للنشر والتوزيع فقط.</DemoNote>
    </Screen>
  );
}
