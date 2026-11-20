"use client";

import Link from "next/link";
import { useState } from "react";
import { audioTracks } from "@/data/catalog";
import { TASBEHA_COLLECTION_ID, TASBEHA_COLLECTION_TITLE, TASBEHA_PERFORMER, TASBEHA_SOURCE, tasbehaSunday } from "@/data/tasbeha";
import { TARANEEM_COLLECTIONS, findStreamTrack } from "@/data/taraneem";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { Chips, FilterBar, ToggleChip, DemoBadge, DemoNote, EmptyState, FavButton, Screen, SectionHeading, cardCls, formatTime, DemoSource } from "@/shared/ui/kit";
import { DownloadIcon, HeartIcon, MusicIcon, TypeIcon } from "@/shared/ui/icons";

const filters = [
  { id: "all", label: "الكل" },
  { id: "taranem", label: "ترانيم" },
  { id: "alhan", label: "ألحان" },
] as const;
type FilterId = (typeof filters)[number]["id"];
const none: string[] = [];

const ar = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

const playerHref = (id: string) => {
  if (id.startsWith("tsb-")) return `/audio/player?c=${TASBEHA_COLLECTION_ID}&id=${id}`;
  const hit = TARANEEM_COLLECTIONS.find((c) => c.tracks.some((t) => t.id === id));
  return hit ? `/audio/player?c=${hit.id}&id=${id}` : `/audio/player?id=${id}`;
};

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
  const lastPlayed =
    findStreamTrack(recent[0]) ??
    audioTracks.find((t) => t.id === recent[0]);
  const toggleFav = (id: string) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <Screen title="ترانيم وألحان" backHref="/sections" intro="اسمع تسبحة الأحد وترانيم وألحان من جوّه التطبيق.">
      {lastPlayed && (
        <section className="px-6 pt-4">
          <Link href={playerHref(lastPlayed.id)} className="bg-primary flex items-center gap-3 rounded-3xl px-4 py-3 text-white transition-transform active:scale-[0.99]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"><MusicIcon className="h-5 w-5" /></span>
            <span className="flex-1 text-right">
              <span className="block text-[11px] font-bold text-white/80">كمّل من حيث وقفت</span>
              <span className="block text-[14px] font-extrabold">{lastPlayed.title}</span>
            </span>
          </Link>
        </section>
      )}

      <section className="px-6 pt-4">
        <SectionHeading>{TASBEHA_COLLECTION_TITLE}</SectionHeading>
        <Link
          href={`/audio/player?c=${TASBEHA_COLLECTION_ID}&id=${tasbehaSunday[0].id}`}
          className="bg-primary mt-2 flex items-center gap-3 rounded-3xl px-4 py-3 text-white transition-transform active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"><MusicIcon className="h-5 w-5" /></span>
          <span className="flex-1 text-right">
            <span className="block text-[14px] font-extrabold">تشغيل التسبحة بالترتيب</span>
            <span className="block text-[11px] font-bold text-white/80">{ar(tasbehaSunday.length)} لحن · {TASBEHA_PERFORMER}</span>
          </span>
        </Link>
        <Link href="/audio/words" className={`${cardCls} mt-3 flex items-center gap-3 p-4 transition-transform active:scale-[0.99]`}>
          <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center"><TypeIcon className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1 text-right">
            <span className="text-ink dark:text-night-ink block text-[14px] font-extrabold">الترانيم المكتوبة</span>
            <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">اقرأ كلمات ألحان التسبحة جوّه التطبيق</span>
          </span>
        </Link>
        <ul className="mt-3 space-y-3">
          {tasbehaSunday.map((track, i) => {
            const heading = i === 0 || tasbehaSunday[i - 1].group !== track.group ? track.group : null;
            return (
              <li key={track.id}>
                {heading && <p className="text-ink/60 dark:text-night-ink/60 pb-1 pt-2 text-right text-[12px] font-extrabold">{heading}</p>}
                <div className={`${cardCls} flex items-center gap-3 p-4`}>
                  <FavButton active={favs.includes(track.id)} onToggle={() => toggleFav(track.id)} label={track.title} />
                  <Link href={playerHref(track.id)} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="min-w-0 flex-1 text-right">
                      <span className="text-ink dark:text-night-ink line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                      <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">استماع أونلاين</span>
                    </span>
                    <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center">
                      <MusicIcon className="h-5 w-5" />
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-ink/50 dark:text-night-ink/50 pt-3 text-center text-[11px] leading-5">
          المصدر: {TASBEHA_SOURCE.name} ·{" "}
          <a href={TASBEHA_SOURCE.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">أرشيف التسبحة</a>
          {" "}· الاستماع يحتاج اتصال بالإنترنت
        </p>
      </section>


      <section className="px-6 pt-4">
        <SectionHeading>ترانيم</SectionHeading>
        {TARANEEM_COLLECTIONS.map((album) => (
          <div key={album.id} className="mt-2">
            <Link
              href={`/audio/player?c=${album.id}&id=${album.tracks[0].id}`}
              className="bg-primary flex items-center gap-3 rounded-3xl px-4 py-3 text-white transition-transform active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"><MusicIcon className="h-5 w-5" /></span>
              <span className="flex-1 text-right">
                <span className="block text-[14px] font-extrabold">{album.title}</span>
                <span className="block text-[11px] font-bold text-white/80">{album.countLabel} · {album.performer}</span>
              </span>
            </Link>
            <ul className="mt-3 space-y-3">
              {album.tracks.map((track) => (
                <li key={track.id} className={`${cardCls} flex items-center gap-3 p-4`}>
                  <FavButton active={favs.includes(track.id)} onToggle={() => toggleFav(track.id)} label={track.title} />
                  <Link href={playerHref(track.id)} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="min-w-0 flex-1 text-right">
                      <span className="text-ink dark:text-night-ink line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                      <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{album.performer} · استماع أونلاين</span>
                    </span>
                    <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center">
                      <MusicIcon className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-ink/50 dark:text-night-ink/50 pt-3 text-center text-[11px] leading-5">
              المصدر: {album.sourceName} ·{" "}
              <a href={album.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">صفحة الألبوم</a>
              {" "}· الاستماع يحتاج اتصال بالإنترنت
            </p>
          </div>
        ))}
      </section>

      <FilterBar toggles={<><ToggleChip label="المفضلة" on={onlyFav} onChange={setOnlyFav} /><ToggleChip label="المحمّلة" on={onlyDownloaded} onChange={setOnlyDownloaded} /></>}>
        <Chips items={filters} value={filter} onChange={setFilter} />
      </FilterBar>

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
