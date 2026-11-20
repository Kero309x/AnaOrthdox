"use client";

import { TASBEHA_SOURCE } from "@/data/tasbeha";
import { LYRICS_SOURCE } from "@/data/tasbehaLyrics";
import { TARANEEM_COLLECTIONS } from "@/data/taraneem";
import { TARANEEM_LYRICS_SOURCE } from "@/data/taraneemLyrics";
import { Screen, SectionHeading, cardCls } from "@/shared/ui/kit";
import { BookIcon, MusicIcon, TypeIcon } from "@/shared/ui/icons";

function SourceRow({
  icon,
  title,
  detail,
  name,
  url,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  name: string;
  url: string;
}) {
  return (
    <div className={`${cardCls} flex items-start gap-3 p-4`}>
      <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-right">
        <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold leading-5">{title}</span>
        <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{detail}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-1.5 block truncate text-[12px] font-bold underline"
        >
          {name}
        </a>
      </span>
    </div>
  );
}

export default function Sources() {
  return (
    <Screen
      title="المصادر"
      backHref="/settings"
      intro="دي صفحات المصادر اللي كل قسم بيعتمد عليها، مع وصف قصير لكل مصدر. مراجعة الكلمات على المصادر لسه شغالة: ألحان التسبحة اتراجعت واتصلح منها مواضع موثقة، ومراجعتها بتكمّل، ومكتبة الترانيم لسه تحت المراجعة. لو في موضع شاككين إن فيه خطأ في المصدر نفسه، بيتراجع وبيتحدد قبل أي تعديل."
    >
      <section className="px-6 pt-4">
        <SectionHeading>الكلمات المكتوبة</SectionHeading>
        <div className="mt-3 space-y-3">
          <SourceRow
            icon={<TypeIcon className="h-5 w-5" />}
            title="كلمات ألحان التسبحة"
            detail="نص كتاب الإبصلمودية المنشور، قبطي بالحروف العربية مع الترجمة — اتراجعت منه مواضع واتصلحت، والمراجعة مكملة"
            name={LYRICS_SOURCE.name}
            url={LYRICS_SOURCE.url}
          />
          <SourceRow
            icon={<TypeIcon className="h-5 w-5" />}
            title="كلمات الترانيم"
            detail="الأسطر المغنّاة من صفحات كلمات الترانيم"
            name={TARANEEM_LYRICS_SOURCE.name}
            url={TARANEEM_LYRICS_SOURCE.url}
          />
        </div>
      </section>

      <section className="px-6 pt-6">
        <SectionHeading>التسجيلات الصوتية</SectionHeading>
        <div className="mt-3 space-y-3">
          <SourceRow
            icon={<MusicIcon className="h-5 w-5" />}
            title="تسجيلات تسبحة الأحد"
            detail="تسجيل تعليمي لنيافة الأنبا رافائيل"
            name={TASBEHA_SOURCE.name}
            url={TASBEHA_SOURCE.url}
          />
          {TARANEEM_COLLECTIONS.map((album) => (
            <SourceRow
              key={album.id}
              icon={<MusicIcon className="h-5 w-5" />}
              title={`تسجيلات ${album.title}`}
              detail={album.performer}
              name={album.sourceName}
              url={album.sourceUrl}
            />
          ))}
        </div>
      </section>

      <section className="px-6 pt-6">
        <div className={`${cardCls} p-4`}>
          <div className="flex items-start gap-3">
            <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center">
              <BookIcon className="h-5 w-5" />
            </span>
            <p className="text-ink/70 dark:text-night-ink/70 flex-1 text-right text-[12px] leading-5">
              ملحوظة: عرض الكلمات للقراءة والمتابعة مع السماع فقط، مش متزامن
              مع التسجيل سطر بسطر، وممكن عدد التكرارات يختلف عن التسجيل.
              لو لاحظت خطأ في النص، قولنا عشان نراجعه مع المصدر.
            </p>
          </div>
        </div>
      </section>
    </Screen>
  );
}
