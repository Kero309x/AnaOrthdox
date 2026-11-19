"use client";

import Link from "next/link";
import { audioTracks, books, videoClips } from "@/data/catalog";
import { churchFavorites } from "@/data/local";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { EmptyState, Panel, Screen, SectionHeading } from "@/shared/ui/kit";
import { HeartIcon } from "@/shared/ui/icons";

const none: string[] = [];
const noRec: Record<string, unknown> = {};

export default function Favorites() {
  const [fa] = useStored("fav.audio", none, isStringArray);
  const [fv] = useStored("fav.video", none, isStringArray);
  const [fb] = useStored("fav.book", none, isStringArray);
  const [later] = useStored("later.video", none, isStringArray);
  const [dayNotes] = useStored("notes.days", noRec, isRecord);
  const [readingNotes] = useStored("notes.readings", noRec, isRecord);
  const [lessonNotes] = useStored("notes.lessons", noRec, isRecord);
  const churches = typeof window === "undefined" ? [] : churchFavorites.list();

  const groups = [
    { title: "ترانيم وألحان", items: audioTracks.filter((t) => fa.includes(t.id)).map((t) => ({ id: t.id, label: t.title, href: `/audio/player?id=${t.id}` })) },
    { title: "فيديوهات", items: videoClips.filter((v) => fv.includes(v.id) || later.includes(v.id)).map((v) => ({ id: v.id, label: v.title, href: `/videos/watch?id=${v.id}` })) },
    { title: "كتب", items: books.filter((b) => fb.includes(b.id)).map((b) => ({ id: b.id, label: b.title, href: `/books/read?id=${b.id}` })) },
    { title: "كنائس", items: churches.map((c) => ({ id: c.id, label: c.name, href: `/churches/${c.id}` })) },
  ].filter((g) => g.items.length > 0);
  const noteCount = [dayNotes, readingNotes, lessonNotes].reduce((n, o) => n + Object.values(o).filter((v) => typeof v === "string" && v.trim()).length, 0);

  return (
    <Screen title="مفضلتي" backHref="/account" intro="كل اللي حفظته على جهازك في مكان واحد.">
      <section className="space-y-4 px-6 pt-4">
        {groups.length === 0 && noteCount === 0 && <EmptyState icon={<HeartIcon className="h-6 w-6" />} title="لسه مفيش حاجة محفوظة" hint="اضغط القلب على أي مقطع أو كتاب أو كنيسة، وهتلاقيه هنا." action={{ label: "كل الأقسام", href: "/sections" }} />}
        {groups.map((g) => (
          <div key={g.title}>
            <SectionHeading>{g.title}</SectionHeading>
            <Panel><ul className="divide-divider dark:divide-divider-dark divide-y">{g.items.map((it) => <li key={it.id}><Link href={it.href} className="text-ink dark:text-night-ink block py-2.5 text-right text-[14px] font-bold">{it.label}</Link></li>)}</ul></Panel>
          </div>
        ))}
        {noteCount > 0 && <Panel><p className="text-ink dark:text-night-ink text-right text-[14px] font-bold">عندك {noteCount} ملاحظة محفوظة في القراءات والتقويم والدراسات.</p></Panel>}
      </section>
    </Screen>
  );
}
