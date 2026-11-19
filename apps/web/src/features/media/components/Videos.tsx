"use client";

import Link from "next/link";
import { useState } from "react";
import { videoClips } from "@/data/catalog";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { Chips, FilterBar, ToggleChip, DemoBadge, DemoNote, EmptyState, FavButton, ProgressBar, Screen, cardCls, DemoSource } from "@/shared/ui/kit";
import { HeartIcon, PlayIcon, VideoIcon } from "@/shared/ui/icons";

const filters = [
  { id: "all", label: "الكل" },
  { id: "ezat", label: "عظات واجتماعات" },
  { id: "taranem", label: "ترانيم مصوّرة" },
] as const;
type FilterId = (typeof filters)[number]["id"];
const none: string[] = [];
const noProgress: Record<string, unknown> = {};

export default function Videos() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyLater, setOnlyLater] = useState(false);
  const [favs, setFavs] = useStored("fav.video", none, isStringArray);
  const [later] = useStored("later.video", none, isStringArray);
  const [progress] = useStored("progress.video", noProgress, isRecord);

  const visible = videoClips.filter((c) => {
    if (onlyFav && !favs.includes(c.id)) return false;
    if (onlyLater && !later.includes(c.id)) return false;
    return filter === "all" || c.kind === filter;
  });

  return (
    <Screen title="فيديوهات" backHref="/sections" intro="شاهد في أي وقت، وكمّل من حيث وقفت.">
      <FilterBar toggles={<><ToggleChip label="المفضلة" on={onlyFav} onChange={setOnlyFav} /><ToggleChip label="شاهد لاحقاً" on={onlyLater} onChange={setOnlyLater} /></>}><Chips items={filters} value={filter} onChange={setFilter} /></FilterBar>
<DemoSource label="الفيديوهات">
      <section className="space-y-4 px-6 pt-4">
        {visible.length === 0 && (
          <EmptyState icon={onlyFav ? <HeartIcon className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />} title={onlyLater ? "مفيش فيديوهات في شاهد لاحقاً" : onlyFav ? "مفيش مفضلة لسه" : "مفيش فيديوهات هنا"} hint="افتح أي فيديو وضيفه من صفحته." />
        )}
        {visible.map((clip) => {
          const seen = typeof progress[clip.id] === "number" ? Math.min(1, Math.max(0, progress[clip.id] as number)) : 0;
          return (
            <div key={clip.id} className={`${cardCls} overflow-hidden`}>
              <Link href={`/videos/watch?id=${clip.id}`} aria-label={`شغّل ${clip.title}`} className="relative block h-44 bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
                <span className="bg-starburst/40 absolute -top-14 -right-14 h-40 w-40 rounded-full" aria-hidden="true" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gold text-gold-ink flex h-14 w-14 items-center justify-center rounded-full"><PlayIcon className="h-6 w-6" /></span>
                </span>
                <span className="bg-primary-deep/80 absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white">فيديو تجريبي قصير</span>
              </Link>
              <div className="flex items-center gap-3 p-4">
                <FavButton active={favs.includes(clip.id)} onToggle={() => setFavs((p) => (p.includes(clip.id) ? p.filter((x) => x !== clip.id) : [...p, clip.id]))} label={clip.title} />
                <span className="min-w-0 flex-1 text-right">
                  <span className="text-ink dark:text-night-ink flex items-center justify-end gap-2 text-[15px] font-extrabold"><DemoBadge /><span className="truncate">{clip.title}</span></span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{clip.channel} · {clip.kind === "ezat" ? "عظات واجتماعات" : "ترانيم مصوّرة"}</span>
                </span>
              </div>
              {seen > 0 && <div className="px-4 pb-4"><ProgressBar value={seen * 100} /></div>}
            </div>
          );
        })}
      </section>
</DemoSource>
      <DemoNote>الفيديوهات الحالية عينات تجريبية لعرض التجربة، وكلها بتشغّل نفس الفيديو التجريبي القصير. مكتبة الفيديو هتتوصّل بمصادر معتمدة.</DemoNote>
    </Screen>
  );
}
