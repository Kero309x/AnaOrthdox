"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { kidsActivities } from "@/data/catalog";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, EmptyState, Panel, ProgressBar, Screen, useShowToast } from "@/shared/ui/kit";
import { BalloonIcon, StarIcon } from "@/shared/ui/icons";

const none: string[] = [];
const COLORS = ["#d94f7a", "#c98a2b", "#4f8f6f", "#4a6fd9", "#8a5bd9"];

export default function KidsActivityView() {
  const id = useSearchParams().get("id");
  const a = kidsActivities.find((x) => x.id === id && x.kind !== "game");
  return (
    <Screen title={a ? a.title : "نشاط"} backHref="/kids">
      {a ? <Activity key={a.id} id={a.id} /> : (
        <section className="px-6 pt-6"><EmptyState icon={<BalloonIcon className="h-6 w-6" />} title="النشاط ده مش موجود" action={{ label: "ركن الأطفال", href: "/kids" }} /></section>
      )}
    </Screen>
  );
}

function Activity({ id }: { id: string }) {
  const a = kidsActivities.find((x) => x.id === id)!;
  const showToast = useShowToast();
  const [stars, setStars] = useStored("done.kids", none, isStringArray);
  const [page, setPage] = useState(0);
  const [color, setColor] = useState(COLORS[0]);
  const [fills, setFills] = useState<string[]>(["", "", "", ""]);
  const last = page >= a.pages.length - 1;
  const got = stars.includes(id);
  const finish = () => { if (!got) setStars((p) => [...p, id]); showToast("برافو، خدت نجمة"); };

  return (
    <section className="space-y-4 px-6 pt-5">
      <div className="flex items-center justify-between"><DemoBadge /><span className="text-ink/60 dark:text-night-ink/60 text-[12px] font-bold">{a.hint}</span></div>
      {a.kind === "color" ? (
        <Panel>
          <p className="text-ink dark:text-night-ink text-right text-[13px] font-bold">اختار لون وبعدين اضغط على الشكل</p>
          <div className="mt-3 flex gap-2" role="group" aria-label="الألوان">{COLORS.map((c) => <button key={c} type="button" aria-label={`لون ${c}`} aria-pressed={color === c} onClick={() => setColor(c)} className={`h-10 w-10 rounded-full border-4 ${color === c ? "border-ink dark:border-night-ink" : "border-white"}`} style={{ background: c }} />)}</div>
          <div className="mt-4 grid grid-cols-2 gap-3">{fills.map((f, i) => <button key={i} type="button" aria-label={`شكل ${i + 1}`} onClick={() => setFills((p) => p.map((x, j) => (j === i ? color : x)))} className="bg-rose-badge h-24 rounded-3xl border-2 border-dashed border-primary" style={f ? { background: f } : undefined} />)}</div>
          <button type="button" onClick={() => setFills(["", "", "", ""])} className="text-primary mt-3 text-[12px] font-bold underline">امسح التلوين</button>
        </Panel>
      ) : (
        <Panel><p className="text-ink dark:text-night-ink min-h-32 text-right text-[16px] leading-9" aria-live="polite">{a.pages[page]}</p><div className="pt-3"><ProgressBar value={((page + 1) / a.pages.length) * 100} /></div></Panel>
      )}
      <div className="flex items-center justify-between gap-3">
        {a.kind !== "color" && (
          <>
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="bg-rose-badge text-primary rounded-full px-5 py-3 text-[13px] font-bold disabled:opacity-40">السابق</button>
            {!last && <button type="button" onClick={() => setPage((p) => p + 1)} className="bg-primary rounded-full px-6 py-3 text-[13px] font-bold text-white active:scale-95">التالي</button>}
          </>
        )}
        {(last || a.kind === "color") && (
          <button type="button" onClick={finish} className="bg-gold text-gold-ink flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-extrabold active:scale-95"><StarIcon className="h-4 w-4" />{got ? "خدت النجمة" : "خلّصت، هات نجمة"}</button>
        )}
      </div>
      <p className="text-center"><Link href="/kids" className="text-primary text-[13px] font-bold underline">ركن الأطفال</Link></p>
      <DemoNote>النشاط تجريبي. النجوم بتتحفظ على الجهاز ده فقط.</DemoNote>
    </section>
  );
}
