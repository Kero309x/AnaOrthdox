"use client";

import { toArabicNumber } from "@/domain/calendar/coptic";
import Link from "next/link";
import { kidsActivities } from "@/data/catalog";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, Screen, cardCls, DemoSource } from "@/shared/ui/kit";
import { BalloonIcon, GridIcon, MusicIcon, OpenBookIcon, PaletteDrawIcon, StarIcon } from "@/shared/ui/icons";

const icons = { story: OpenBookIcon, taranem: MusicIcon, color: PaletteDrawIcon, game: GridIcon } as const;
const none: string[] = [];

export default function Kids() {
  const [stars] = useStored("done.kids", none, isStringArray);
  return (
    <Screen title="ركن الأطفال" backHref="/sections" intro="قسم خاص بالأطفال.">
<DemoSource label="أنشطة الأطفال">
      <section className="px-6 pt-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,#c98a2b_0%,#b1761c_50%,#96620f_100%)] px-6 py-8">
          <span className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10" aria-hidden="true" />
          <span className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20"><BalloonIcon className="h-6 w-6 text-white" /></span>
            <div>
              <p className="text-xl font-black text-white">مكان آمن وفرحان لأولادنا</p>
              <p className="mt-1 flex items-center gap-1 text-[13px] leading-6 text-white/85"><StarIcon className="h-4 w-4" /> نجوم النهاردة: {toArabicNumber(stars.length)} من {toArabicNumber(kidsActivities.length)}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-3 px-6 pt-4">
        {kidsActivities.map((a) => {
          const Icon = icons[a.kind];
          const href = a.kind === "game" ? "/games/memory" : `/kids/activity?id=${a.id}`;
          const got = stars.includes(a.id);
          return (
            <Link key={a.id} href={href} className={`${cardCls} flex items-center gap-3 p-4 transition-transform active:scale-[0.99]`}>
              {got && <StarIcon className="text-gold h-5 w-5 shrink-0" />}
              <span className="min-w-0 flex-1 text-right">
                <span className="text-ink dark:text-night-ink flex items-center justify-end gap-2 text-[15px] font-extrabold">{a.kind !== "game" && <DemoBadge />}<span className="truncate">{a.title}</span></span>
                <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{a.hint}</span>
              </span>
              <span className={`icon-badge icon-badge--soft-square flex h-10 w-10 shrink-0 items-center justify-center ${a.kind === "story" || a.kind === "color" ? "bg-gold-soft text-gold-ink" : "bg-rose-badge text-primary"}`}><Icon className="h-5 w-5" /></span>
            </Link>
          );
        })}
      </section>
</DemoSource>
      <DemoNote>من غير إعلانات ولا مشتريات. القصص والأنشطة الحالية عينات تجريبية لعرض التجربة.</DemoNote>
    </Screen>
  );
}
