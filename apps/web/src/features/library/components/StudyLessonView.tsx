"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { studies } from "@/data/catalog";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, EmptyState, Panel, Screen, useShowToast } from "@/shared/ui/kit";
import { CapIcon, CheckIcon } from "@/shared/ui/icons";

const none: string[] = [];
const noRec: Record<string, unknown> = {};

export default function StudyLessonView() {
  const p = useSearchParams();
  const study = studies.find((s) => s.id === p.get("s"));
  const lesson = study?.lessons.find((l) => l.id === p.get("l"));
  return (
    <Screen title={study ? study.title : "الدرس"} backHref="/studies">
      {study && lesson ? <Lesson key={`${study.id}:${lesson.id}`} sid={study.id} lid={lesson.id} /> : (
        <section className="px-6 pt-6"><EmptyState icon={<CapIcon className="h-6 w-6" />} title="الدرس ده مش موجود" action={{ label: "كل الدراسات", href: "/studies" }} /></section>
      )}
    </Screen>
  );
}

function Lesson({ sid, lid }: { sid: string; lid: string }) {
  const study = studies.find((s) => s.id === sid)!;
  const i = study.lessons.findIndex((l) => l.id === lid);
  const lesson = study.lessons[i];
  const key = `${sid}:${lid}`;
  const showToast = useShowToast();
  const [done, setDone] = useStored("done.lessons", none, isStringArray);
  const [notes, setNotes] = useStored("notes.lessons", noRec, isRecord);
  const [picked, setPicked] = useState<number | null>(null);
  const finished = done.includes(key);
  const note = typeof notes[key] === "string" ? (notes[key] as string) : "";
  const next = study.lessons[i + 1];

  return (
    <section className="space-y-4 px-6 pt-5">
      <div className="flex items-center justify-between"><DemoBadge /><span className="text-ink dark:text-night-ink text-lg font-black">{lesson.title.replace(" (تجريبي)", "")}</span></div>
      <Panel><ul className="space-y-3">{lesson.points.map((pt) => <li key={pt} className="text-ink dark:text-night-ink text-right text-[14px] leading-7">• {pt}</li>)}</ul></Panel>

      <Panel>
        <p className="text-ink dark:text-night-ink text-right text-[14px] font-extrabold">{lesson.question.text}</p>
        <div className="mt-3 space-y-2">
          {lesson.question.options.map((opt, idx) => {
            const chosen = picked === idx;
            const right = picked !== null && idx === lesson.question.answer;
            return (
              <button key={opt} type="button" disabled={picked !== null} onClick={() => setPicked(idx)} className={`w-full rounded-2xl px-4 py-3 text-right text-[13px] font-bold transition-colors ${right ? "bg-primary text-white" : chosen ? "bg-gold-soft text-gold-ink" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}>{opt}</button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p role="status" className="text-ink dark:text-night-ink text-[13px] font-bold">{picked === lesson.question.answer ? "إجابة صحيحة" : "مش دي، الإجابة الصحيحة متعلّمة"}</p>
            <button type="button" onClick={() => setPicked(null)} className="text-primary text-[12px] font-bold underline">جرّب تاني</button>
          </div>
        )}
      </Panel>

      <Panel>
        <label htmlFor="note" className="text-ink dark:text-night-ink block text-right text-[13px] font-extrabold">ملاحظاتك على الدرس</label>
        <textarea id="note" value={note} maxLength={800} onChange={(e) => setNotes((p) => ({ ...p, [key]: e.target.value }))} placeholder="اكتب اللي استفدته" className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink mt-2 h-24 w-full resize-none rounded-2xl p-3 text-[13px] outline-none" />
        <p className="text-ink/50 dark:text-night-ink/50 mt-1 text-[11px]">بتتحفظ تلقائياً على جهازك.</p>
      </Panel>

      <div className="flex gap-3">
        <button type="button" onClick={() => { setDone((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key])); showToast(finished ? "اتشالت علامة الإنجاز" : "تم، الدرس اتحسب"); }} aria-pressed={finished} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[13px] font-bold active:scale-95 ${finished ? "bg-gold-soft text-gold-ink" : "bg-primary text-white"}`}>
          <CheckIcon className="h-4 w-4" />{finished ? "خلّصت الدرس" : "علّم إنك خلّصت"}
        </button>
        {next && <Link href={`/studies/lesson?s=${sid}&l=${next.id}`} className="bg-rose-badge text-primary rounded-full px-5 py-3 text-[13px] font-bold active:scale-95">الدرس التالي</Link>}
      </div>
      <DemoNote>الدرس والسؤال تجريبيين لعرض التجربة، مش محتوى معتمد.</DemoNote>
    </section>
  );
}
