"use client";

import Link from "next/link";
import { useState } from "react";
import { TASBEHA_COLLECTION_ID, TASBEHA_COLLECTION_TITLE, tasbehaSunday } from "@/data/tasbeha";
import { LYRICS_GAPS, LYRICS_SOURCE, tasbehaLyrics } from "@/data/tasbehaLyrics";
import { TARANEEM_COLLECTIONS } from "@/data/taraneem";
import { TARANEEM_LYRICS_GAPS, TARANEEM_LYRICS_SOURCE, taraneemLyrics } from "@/data/taraneemLyrics";
import { TARANEEM_LIBRARY } from "@/data/taraneemLibrary";
import { Screen, SectionHeading, cardCls } from "@/shared/ui/kit";
import { ChevronLeftIcon, MusicIcon, TypeIcon } from "@/shared/ui/icons";
import { LyricLines } from "./LyricLines";

export default function Words() {
  const [open, setOpen] = useState<string | null>(null);
  const [libQuery, setLibQuery] = useState("");
  const libFiltered = TARANEEM_LIBRARY.filter((e) => !libQuery.trim() || e.title.includes(libQuery.trim()))
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, "ar"));
  const normFirstLetter = (ch: string) => (ch === "أ" || ch === "آ" || ch === "إ" ? "ا" : ch);
  const libGroups: { letter: string; entries: typeof TARANEEM_LIBRARY }[] = [];
  for (const e of libFiltered) {
    const letter = normFirstLetter(e.title.trim().charAt(0));
    const last = libGroups[libGroups.length - 1];
    if (last && last.letter === letter) last.entries.push(e);
    else libGroups.push({ letter, entries: [e] });
  }
  return (
    <Screen title="الترانيم المكتوبة" backHref="/audio" intro="اقرأ كلمات ألحان تسبحة الأحد والترانيم جوّه التطبيق، واسمعها من نفس المكان. الكلمات للقراءة والمتابعة مع السماع، مش متزامنة مع التسجيل سطر بسطر، وممكن عدد التكرارات يختلف عن التسجيل. كل المصادر متجمّعة في صفحة المصادر في الإعدادات.">
      <section className="px-6 pt-4">
        <SectionHeading>{TASBEHA_COLLECTION_TITLE}</SectionHeading>
        <ul className="mt-3 space-y-3">
          {tasbehaSunday.map((track, i) => {
            const heading = i === 0 || tasbehaSunday[i - 1].group !== track.group ? track.group : null;
            const lyrics = tasbehaLyrics[track.id];
            const isOpen = open === track.id;
            return (
              <li key={track.id}>
                {heading && <p className="text-ink/60 dark:text-night-ink/60 pb-1 pt-2 text-right text-[12px] font-extrabold">{heading}</p>}
                <div className={`${cardCls} p-4`}>
                  <div className="flex items-center gap-3">
                    <Link href={`/audio/player?c=${TASBEHA_COLLECTION_ID}&id=${track.id}`} aria-label={`استمع إلى ${track.title}`} className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center transition-transform active:scale-95">
                      <MusicIcon className="h-5 w-5" />
                    </Link>
                    {lyrics ? (
                      <button type="button" onClick={() => setOpen(isOpen ? null : track.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="min-w-0 flex-1 text-right">
                          <span className="text-ink dark:text-night-ink line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                          <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{isOpen ? "إخفاء الكلمات" : "عرض الكلمات"}</span>
                        </span>
                        <ChevronLeftIcon className={`text-ink/40 h-4 w-4 shrink-0 transition-transform ${isOpen ? "-rotate-90" : "rotate-0"}`} />
                      </button>
                    ) : (
                      <span className="min-w-0 flex-1 text-right">
                        <span className="text-ink/70 dark:text-night-ink/70 line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                        <span className="text-ink/45 dark:text-night-ink/45 mt-0.5 block text-[11px] leading-4">الكلمات مش متاحة لسه</span>
                      </span>
                    )}
                  </div>
                  {isOpen && lyrics && (
                    <div className="border-ink/10 dark:border-night-ink/10 mt-3 border-t pt-3">
                      <LyricLines lines={lyrics.lines} unevenPairing={lyrics.unevenPairing} verifiedPairing={lyrics.verifiedPairing} />
                      <p className="text-ink/50 dark:text-night-ink/50 pt-3 text-[11px] leading-5">
                        الكلمات من {LYRICS_SOURCE.name} ·{" "}
                        {lyrics.sources.map((s, k) => (
                          <span key={s}>
                            {k > 0 && " · "}
                            <a href={s} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">صفحة الكلمات{lyrics.sources.length > 1 ? ` ${k + 1}` : ""}</a>
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-ink/50 dark:text-night-ink/50 pt-4 text-center text-[11px] leading-5">
          <TypeIcon className="me-1 inline h-3.5 w-3.5 align-[-2px]" />
          كلمات {tasbehaSunday.length - LYRICS_GAPS.length} لحن من {tasbehaSunday.length} متاحة الآن من {LYRICS_SOURCE.name} ·{" "}
          <a href={LYRICS_SOURCE.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">كتاب الإبصلمودية</a>
        </p>
      </section>

      <section className="px-6 pt-6">
        <SectionHeading>ترانيم</SectionHeading>
        {TARANEEM_COLLECTIONS.map((album) => (
          <div key={album.id} className="mt-3">
            <p className="text-ink/60 dark:text-night-ink/60 pb-1 pt-2 text-right text-[12px] font-extrabold">{album.title} · {album.performer}</p>
            <ul className="space-y-3">
              {album.tracks.map((track) => {
                const lyrics = taraneemLyrics[track.id];
                const isOpen = open === track.id;
                return (
                  <li key={track.id} className={`${cardCls} p-4`}>
                    <div className="flex items-center gap-3">
                      <Link href={`/audio/player?c=${album.id}&id=${track.id}`} aria-label={`استمع إلى ${track.title}`} className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center transition-transform active:scale-95">
                        <MusicIcon className="h-5 w-5" />
                      </Link>
                      {lyrics ? (
                        <button type="button" onClick={() => setOpen(isOpen ? null : track.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="min-w-0 flex-1 text-right">
                            <span className="text-ink dark:text-night-ink line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                            <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{isOpen ? "إخفاء الكلمات" : "عرض الكلمات"}</span>
                          </span>
                          <ChevronLeftIcon className={`text-ink/40 h-4 w-4 shrink-0 transition-transform ${isOpen ? "-rotate-90" : "rotate-0"}`} />
                        </button>
                      ) : (
                        <span className="min-w-0 flex-1 text-right">
                          <span className="text-ink/70 dark:text-night-ink/70 line-clamp-2 block text-[15px] font-extrabold leading-5">{track.title}</span>
                          <span className="text-ink/45 dark:text-night-ink/45 mt-0.5 block text-[11px] leading-4">الكلمات مش متاحة لسه</span>
                        </span>
                      )}
                    </div>
                    {isOpen && lyrics && (
                      <div className="border-ink/10 dark:border-night-ink/10 mt-3 border-t pt-3">
                        <LyricLines lines={lyrics.lines} unevenPairing={lyrics.unevenPairing} verifiedPairing={lyrics.verifiedPairing} />
                        <p className="text-ink/50 dark:text-night-ink/50 pt-3 text-[11px] leading-5">
                          الكلمات من {TARANEEM_LYRICS_SOURCE.name} ·{" "}
                          <a href={lyrics.sources[0]} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">صفحة الكلمات</a>
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p className="text-ink/50 dark:text-night-ink/50 pt-4 text-center text-[11px] leading-5">
          كلمات {TARANEEM_COLLECTIONS.flatMap((a) => a.tracks).length - TARANEEM_LYRICS_GAPS.length} ترنيمة من {TARANEEM_COLLECTIONS.flatMap((a) => a.tracks).length} متاحة الآن · المقدمة وترنيمة واحدة من غير نص مؤكد معلَّمين بوضوح
        </p>
      </section>

      <section className="px-6 pt-6">
        <SectionHeading>مكتبة الترانيم</SectionHeading>
        <p className="text-ink/60 dark:text-night-ink/60 pt-2 text-right text-[12px] leading-5">
          دفعة أولى من كلمات ترانيم سانت تكلا ({TARANEEM_LIBRARY.length} ترنيمة) منقولة حرفيًا من صفحات الكلمات، قيد المراجعة والتوسيع — بدون تسجيلات مربوطة لسه.
        </p>
        <input
          type="search"
          value={libQuery}
          onChange={(ev) => setLibQuery(ev.target.value)}
          placeholder="دوّر باسم الترنيمة…"
          aria-label="البحث في مكتبة الترانيم"
          className="border-ink/15 dark:border-night-ink/15 bg-ink/5 dark:bg-night-ink/5 text-ink dark:text-night-ink placeholder:text-ink/40 dark:placeholder:text-night-ink/40 mt-3 w-full rounded-2xl border px-4 py-2.5 text-right text-[14px] font-bold outline-none focus:border-primary"
        />
        {libFiltered.length === 0 && (
          <p className="text-ink/50 dark:text-night-ink/50 pt-4 text-center text-[12px]">مفيش نتائج لبحثك ده في المكتبة.</p>
        )}
        {libGroups.map((g) => (
          <div key={g.letter} className="mt-3">
            <p className="text-ink/60 dark:text-night-ink/60 pb-1 pt-2 text-right text-[12px] font-extrabold">{g.letter}</p>
            <ul className="space-y-3">
              {g.entries.map((e) => {
                const isOpen = open === e.id;
                return (
                  <li key={e.id} className={`${cardCls} p-4`}>
                    <button type="button" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="min-w-0 flex-1 text-right">
                        <span className="text-ink dark:text-night-ink line-clamp-2 block text-[15px] font-extrabold leading-5">{e.title}</span>
                        <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{isOpen ? "إخفاء الكلمات" : "عرض الكلمات"}</span>
                      </span>
                      <ChevronLeftIcon className={`text-ink/40 h-4 w-4 shrink-0 transition-transform ${isOpen ? "-rotate-90" : "rotate-0"}`} />
                    </button>
                    {isOpen && (
                      <div className="border-ink/10 dark:border-night-ink/10 mt-3 border-t pt-3">
                        <LyricLines lines={e.lines} />
                        <p className="text-ink/50 dark:text-night-ink/50 pt-3 text-[11px] leading-5">
                          الكلمات من {TARANEEM_LYRICS_SOURCE.name} ·{" "}
                          <a href={e.source} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">صفحة الكلمات</a>
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p className="text-ink/50 dark:text-night-ink/50 pt-4 text-center text-[11px] leading-5">
          المكتبة الكاملة فيها آلاف الترانيم — دي دفعة أولى قابلة للتوسيع، مش الفهرس الكامل
        </p>
      </section>
    </Screen>
  );
}
