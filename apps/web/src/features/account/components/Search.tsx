"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { audioTracks, books, kidsActivities, studies, videoClips } from "@/data/catalog";
import { churchFavorites } from "@/data/local";
import { norm } from "@/features/games/components/Words";
import { EmptyState, Panel, Screen, DemoSource } from "@/shared/ui/kit";
import { GridIcon } from "@/shared/ui/icons";

const SECTIONS = [
  ["الصلوات", "/prayers"], ["قراءة اليوم", "/readings"], ["التقويم القبطي", "/calendar"], ["الكنائس", "/churches"],
  ["ترانيم وألحان", "/audio"], ["فيديوهات", "/videos"], ["دراسات الكتاب المقدس", "/studies"], ["مكتبة الكتب", "/books"],
  ["ركن الأطفال", "/kids"], ["ألعاب ومسابقات", "/games"], ["البوصلة", "/compass"], ["الإعدادات", "/settings"], ["حسابي", "/account"],
] as const;

export default function Search() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = norm(q);
    if (!term) return [];
    const all = [
      ...SECTIONS.map(([label, href]) => ({ group: "الأقسام", label, href })),
      ...audioTracks.map((t) => ({ group: "ترانيم وألحان", label: t.title, href: `/audio/player?id=${t.id}` })),
      ...videoClips.map((v) => ({ group: "فيديوهات", label: v.title, href: `/videos/watch?id=${v.id}` })),
      ...books.map((b) => ({ group: "كتب", label: b.title, href: `/books/read?id=${b.id}` })),
      ...studies.map((s) => ({ group: "دراسات", label: s.title, href: `/studies/lesson?s=${s.id}&l=${s.lessons[0].id}` })),
      ...kidsActivities.map((a) => ({ group: "ركن الأطفال", label: a.title, href: a.kind === "game" ? "/games/memory" : `/kids/activity?id=${a.id}` })),
      ...churchFavorites.list().map((c) => ({ group: "كنائسك", label: `${c.name} ${c.area}`, href: `/churches/${c.id}` })),
    ];
    return all.filter((r) => norm(r.label).includes(term)).slice(0, 30);
  }, [q]);

  return (
    <Screen title="بحث" backHref="/sections">
      <section className="space-y-3 px-6 pt-5">
        <input type="search" autoFocus aria-label="ابحث في التطبيق" placeholder="ابحث في الأقسام والمحتوى" value={q} onChange={(e) => setQ(e.target.value)} className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink w-full rounded-full px-5 py-3.5 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" />
<DemoSource label="نتائج البحث">
        {q.trim() && results.length === 0 && <EmptyState icon={<GridIcon className="h-6 w-6" />} title="مفيش نتايج" hint="جرّب كلمة تانية أو تصفّح كل الأقسام." action={{ label: "كل الأقسام", href: "/sections" }} />}
        {results.length > 0 && <Panel><ul className="divide-divider dark:divide-divider-dark divide-y">{results.map((r) => <li key={r.href + r.label}><Link href={r.href} className="flex items-center justify-between gap-3 py-2.5"><span className="bg-rose-badge text-primary shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold">{r.group}</span><span className="text-ink dark:text-night-ink flex-1 text-right text-[14px] font-bold">{r.label}</span></Link></li>)}</ul></Panel>}
</DemoSource>
        <p className="text-ink/50 dark:text-night-ink/50 pt-2 text-center text-[11px] leading-5">البحث في أقسام التطبيق والمحتوى المتاح حالياً على جهازك.</p>
      </section>
    </Screen>
  );
}
