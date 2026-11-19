"use client";

import Link from "next/link";
import { useState } from "react";
import { audioTracks } from "@/data/catalog";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { Chips, FilterBar, ToggleChip, DemoBadge, DemoNote, EmptyState, FavButton, Screen, cardCls, formatTime, DemoSource } from "@/shared/ui/kit";
import { DownloadIcon, HeartIcon, MusicIcon } from "@/shared/ui/icons";

const filters = [
  { id: "all", label: "الكل" },
  { id: "taranem", label: "ترانيم" },
  { id: "alhan", label: "ألحان" },
] as const;
type FilterId = (typeof filters)[number]["id"];
const none: string[] = [];

export default function Audio() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);
  const [favs, setFavs] = useStored("fav.audio", none, isStringArray);
  const [downloaded] = useStored("downloaded.audio", none, isStringArray);
  const [recent] = useStored("recent.audio", none, isStringArray);

  const visible = audioTracks.filter((t) => {
    if (onlyFav && !favs.includes(t.id)) return false;
    if (onlyDownloaded && !downloaded.includes(t.id)) return false;
    return filter === "all" || t.kind === filter;
  });
  const lastPlayed = audioTracks.find((t) => t.id === recent[0]);
  const toggleFav = (id: string) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <Screen title="ترانيم وألحان" backHref="/sections" intro="اسمع أو حمّل للاستماع من غير نت.">
      <FilterBar toggles={<><ToggleChip label="المفضلة" on={onlyFav} onChange={setOnlyFav} /><ToggleChip label="المحمّلة" on={onlyDownloaded} onChange={setOnlyDownloaded} /></>}>
        <Chips items={filters} value={filter} onChange={setFilter} />
      </FilterBar>

      {lastPlayed && filter === "all" && (
        <section className="px-6 pt-4">
          <Link href={`/audio/player?id=${lastPlayed.id}`} className="bg-primary flex items-center gap-3 rounded-3xl px-4 py-3 text-white transition-transform active:scale-[0.99]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"><MusicIcon className="h-5 w-5" /></span>
            <span className="flex-1 text-right">
              <span className="block text-[11px] font-bold text-white/80">كمّل من حيث وقفت</span>
              <span className="block text-[14px] font-extrabold">{lastPlayed.title}</span>
            </span>
          </Link>
        </section>
      )}

<DemoSource label="الترانيم">
      <section className="px-6 pt-4">
        {visible.length === 0 ? (
          onlyDownloaded ? (
            <EmptyState icon={<DownloadIcon className="h-6 w-6" />} title="لسه مفيش حاجة محمّلة على جهازك" hint="افتح أي مقطع واضغط تنزيل، وهيظهر هنا." />
          ) : onlyFav ? (
            <EmptyState icon={<HeartIcon className="h-6 w-6" />} title="مفيش مفضلة لسه" hint="اضغط القلب جنب أي مقطع لحفظه هنا." />
          ) : (
            <EmptyState icon={<MusicIcon className="h-6 w-6" />} title="مفيش مقاطع في القسم ده" />
          )
        ) : (
          <ul className="space-y-3">
            {visible.map((track) => (
              <li key={track.id} className={`${cardCls} flex items-center gap-3 p-4`}>
                <FavButton active={favs.includes(track.id)} onToggle={() => toggleFav(track.id)} label={track.title} />
                <Link href={`/audio/player?id=${track.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="min-w-0 flex-1 text-right">
                    <span className="text-ink dark:text-night-ink flex items-center justify-end gap-2 text-[15px] font-extrabold">
                      <DemoBadge />
                      <span className="truncate">{track.title}</span>
                    </span>
                    <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                      {track.artist} · {formatTime(track.seconds)}
                      {downloaded.includes(track.id) ? " · محمّل" : ""}
                    </span>
                  </span>
                  <span className={`icon-badge icon-badge--soft-square flex h-11 w-11 shrink-0 items-center justify-center ${track.kind === "taranem" ? "bg-rose-badge text-primary" : "bg-gold-soft text-gold-ink"}`}>
                    <MusicIcon className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
</DemoSource>
      <DemoNote>المقاطع الحالية عينات تجريبية لعرض المشغّل، ومكتبة الترانيم والألحان هتتوصّل بمحتوى مرخّص. التنزيل للمحتوى المسموح بنشره وتوزيعه فقط.</DemoNote>
    </Screen>
  );
}
