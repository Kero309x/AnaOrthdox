"use client";

import { toArabicNumber } from "@/domain/calendar/coptic";
import Link from "next/link";
import { studies } from "@/data/catalog";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, ProgressBar, Screen, cardCls, DemoSource } from "@/shared/ui/kit";
import { CapIcon, CheckIcon } from "@/shared/ui/icons";

const none: string[] = [];

export default function Studies() {
  const [done] = useStored("done.lessons", none, isStringArray);
  return (
    <Screen title="دراسات الكتاب المقدس" backHref="/sections" intro="دراسات مرتبة للقراءة والتأمل. تقدّمك بيتحفظ على جهازك.">
<DemoSource label="الدراسات">
      <section className="space-y-3 px-6 pt-4">
        {studies.map((study) => {
          const finished = study.lessons.filter((l) => done.includes(`${study.id}:${l.id}`)).length;
          const next = study.lessons.find((l) => !done.includes(`${study.id}:${l.id}`)) ?? study.lessons[0];
          return (
            <div key={study.id} className={`${cardCls} p-4`}>
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1 text-right">
                  <span className="text-ink dark:text-night-ink flex items-center justify-end gap-2 text-[15px] font-extrabold"><DemoBadge /><span className="truncate">{study.title}</span></span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{study.subtitle} · خلّصت {toArabicNumber(finished)} من {toArabicNumber(study.lessons.length)}</span>
                </span>
                <span className="icon-badge icon-badge--soft-square bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center"><CapIcon className="h-5 w-5" /></span>
              </div>
              <div className="mt-3"><ProgressBar value={(finished / study.lessons.length) * 100} /></div>
              <div className="mt-3 flex flex-wrap gap-2">
                {study.lessons.map((l) => {
                  const ok = done.includes(`${study.id}:${l.id}`);
                  return (
                    <Link key={l.id} href={`/studies/lesson?s=${study.id}&l=${l.id}`} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold ${ok ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>
                      {ok && <CheckIcon className="h-3 w-3" />}{l.title.replace(" (تجريبي)", "")}
                    </Link>
                  );
                })}
              </div>
              <Link href={`/studies/lesson?s=${study.id}&l=${next.id}`} className="bg-primary mt-3 block rounded-full py-2.5 text-center text-[13px] font-bold text-white active:scale-95">{finished === 0 ? "ابدأ الدراسة" : finished === study.lessons.length ? "راجع الدراسة" : "كمّل الدراسة"}</Link>
            </div>
          );
        })}
      </section>
</DemoSource>
      <DemoNote>الدراسات الحالية عينات تجريبية لعرض الدروس والأسئلة والتقدّم، مش محتوى معتمد.</DemoNote>
    </Screen>
  );
}
