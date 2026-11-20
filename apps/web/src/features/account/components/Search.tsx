"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { audioTracks, books, kidsActivities, studies, videoClips } from "@/data/catalog";
import { churchFavorites } from "@/data/local";
import { EmptyState, Panel, Screen, DemoSource } from "@/shared/ui/kit";
import { GridIcon } from "@/shared/ui/icons";

// Section entries carry curated aliases so natural word forms find them
// ("صلاة" -> الصلوات, "ترنيمة" -> ترانيم وألحان). Aliases are hand-picked per
// section - accurate matching, no automatic stemming that could guess wrong.
const SECTIONS = [
  ["الصلوات", "/prayers", "صلاة أجبية مزامير مزمور باكر عشية نوم"],
  ["قراءة اليوم", "/readings", "قراءة قراءات إنجيل مزمور قداس"],
  ["التقويم القبطي", "/calendar", "تقويم عيد أعياد صوم أصوام شهور شهر"],
  ["الكنائس", "/churches", "كنيسة قداس قداسات"],
  ["ترانيم وألحان", "/audio", "ترنيمة ترنيم لحن أغنية صوت"],
  ["فيديوهات", "/videos", "فيديو عظة اجتماع مشاهدة"],
  ["دراسات الكتاب المقدس", "/studies", "دراسة تفسير كلمة"],
  ["مكتبة الكتب", "/books", "كتاب كتب مطالعة"],
  ["ركن الأطفال", "/kids", "أطفال طفل قصة ولاد"],
  ["ألعاب ومسابقات", "/games", "لعبة مسابقة سؤال أسئلة"],
  ["البوصلة", "/compass", "اتجاه شرق"],
  ["الإعدادات", "/settings", "إعداد ضبط لون خط"],
  ["حسابي", "/account", "حساب"],
] as const;

// Token-wise matching: normalize Arabic letter variants, strip the definite
// article, then require every query token to prefix-match a searchable token.
// Prefixes cover typing-in-progress and common word forms without guessing.
const normalizeToken = (s: string) =>
  s.trim().replace(/[\u064B-\u065F\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي");

const tokensOf = (s: string) =>
  normalizeToken(s).split(/\s+/).filter(Boolean).map((t) => t.replace(/^ال/, ""));

const matchesQuery = (searchable: string, query: string) => {
  const hay = tokensOf(searchable);
  return tokensOf(query).every((qt) => hay.some((ht) => ht.startsWith(qt)));
};

export default function Search() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim();
    if (!term) return [];
    const all = [
      ...SECTIONS.map(([label, href, aliases]) => ({ group: "الأقسام", label, href, searchable: `${label} ${aliases}` })),
      ...audioTracks.map((t) => ({ group: "ترانيم وألحان", label: t.title, href: `/audio/player?id=${t.id}`, searchable: t.title })),
      ...videoClips.map((v) => ({ group: "فيديوهات", label: v.title, href: `/videos/watch?id=${v.id}`, searchable: v.title })),
      ...books.map((b) => ({ group: "كتب", label: b.title, href: `/books/read?id=${b.id}`, searchable: `${b.title} ${b.author ?? ""}` })),
      ...studies.map((s) => ({ group: "دراسات", label: s.title, href: `/studies/lesson?s=${s.id}&l=${s.lessons[0].id}`, searchable: s.title })),
      ...kidsActivities.map((a) => ({ group: "ركن الأطفال", label: a.title, href: a.kind === "game" ? "/games/memory" : `/kids/activity?id=${a.id}`, searchable: a.title })),
      ...churchFavorites.list().map((c) => ({ group: "كنائسك", label: `${c.name} ${c.area}`, href: `/churches/${c.id}`, searchable: `${c.name} ${c.area}` })),
    ];
    return all.filter((r) => matchesQuery(r.searchable, term)).slice(0, 30);
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
