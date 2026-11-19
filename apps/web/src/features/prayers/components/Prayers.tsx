"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottomNav, Header, SectionTitle, useTheme } from "@/shared/ui/chrome";
import { CrossIcon, CheckIcon } from "@/shared/ui/icons";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { toArabicNumber } from "@/domain/calendar/coptic";

const none: string[] = [];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Structure and meanings follow the Agpeya (كتاب السواعي): seven timed
// prayers through the day, plus the midnight Tasbeha. Full prayer texts are
// intentionally left for a future version instead of partial transcription.
const hours = [
  {
    id: "baaker",
    name: "صلاة باكر",
    time: "حوالي ٦ صباحاً",
    meaning: "شكر الله على بداية يوم جديد، وذكرى قيامة السيد المسيح.",
  },
  {
    id: "thalitha",
    name: "الساعة الثالثة",
    time: "٩ صباحاً",
    meaning: "ذكرى حلول الروح القدس على التلاميذ.",
  },
  {
    id: "sadisa",
    name: "الساعة السادسة",
    time: "١٢ ظهراً",
    meaning: "ذكرى صلب السيد المسيح.",
  },
  {
    id: "taseaa",
    name: "الساعة التاسعة",
    time: "٣ عصراً",
    meaning: "ذكرى وفاة السيد المسيح بالجسد على الصليب.",
  },
  {
    id: "ghoroub",
    name: "صلاة الغروب",
    time: "مع غروب الشمس",
    meaning: "شكر على انقضاء النهار، وذكرى إنزال الجسد من على الصليب.",
  },
  {
    id: "noum",
    name: "صلاة النوم",
    time: "قبل النوم",
    meaning: "تسليم النفس لله قبل النوم، وذكرى وضع الجسد المقدس في القبر.",
  },
  {
    id: "montasaf",
    name: "صلاة نصف الليل",
    time: "منتصف الليل",
    meaning: "السهر والاستعداد للمجيء الثاني، وتشمل ثلاث هججات.",
  },
];

export default function Prayers() {
  const { dark, toggleTheme } = useTheme();
  const [done, setDone] = useStored("done.prayers", none, isStringArray);
  const [today, setToday] = useState("");
  useEffect(() => setToday(todayKey()), []);
  const isDone = (id: string) => done.includes(`${today}:${id}`);
  const toggle = (id: string) => setDone((p) => (p.includes(`${today}:${id}`) ? p.filter((x) => x !== `${today}:${id}`) : [...p.filter((x) => x.startsWith(today) || p.length < 400), `${today}:${id}`]));
  const count = hours.filter((h) => isDone(h.id)).length;

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="الصلوات"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          الأجبية هي كتاب السواعي: سبع صلوات مرتبة على مدار اليوم، وكل ساعة
          بتفتكر مرحلة من حياة السيد المسيح.
        </p>

        <section className="px-6 pt-3">
          <div className="bg-rose-badge text-primary flex items-center justify-between rounded-3xl px-5 py-3">
            <Link href="/settings" className="text-[12px] font-bold underline">ضبط تذكير</Link>
            <span className="text-[14px] font-extrabold" aria-live="polite">صلّيت {toArabicNumber(count)} من {toArabicNumber(hours.length)} النهاردة</span>
          </div>
        </section>

        <section className="px-6 pt-2">
          <div className="space-y-3 pt-2">
            {hours.map((hour) => (
              <div
                key={hour.id}
                id={hour.id}
                className="scroll-mt-24 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
              >
                <div className="flex items-center gap-3">
                  <span className="icon-badge icon-badge--pebble bg-gold-soft text-gold-ink flex h-11 w-11 shrink-0 items-center justify-center">
                    <CrossIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1 text-right">
                    <p className="text-ink dark:text-night-ink text-base font-extrabold">
                      {hour.name}
                    </p>
                    <p className="text-nav-label dark:text-night-ink/60 text-xs font-bold">
                      {hour.time}
                    </p>
                  </div>
                </div>
                <p className="text-ink/65 dark:text-night-ink/65 mt-2.5 text-right text-[12px] leading-5">
                  {hour.meaning}
                </p>
                <button
                  type="button"
                  aria-pressed={isDone(hour.id)}
                  onClick={() => toggle(hour.id)}
                  disabled={!today}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold transition-transform active:scale-95 ${isDone(hour.id) ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}
                >
                  {isDone(hour.id) && <CheckIcon className="h-4 w-4" />}
                  {isDone(hour.id) ? "صلّيت" : "علّم إنك صلّيت"}
                </button>
              </div>
            ))}

            <div
              id="tasbeha"
              className="scroll-mt-24 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <span className="icon-badge icon-badge--pebble bg-rose-badge text-primary flex h-11 w-11 shrink-0 items-center justify-center">
                  <CrossIcon className="h-5 w-5" />
                </span>
                <div className="flex-1 text-right">
                  <p className="text-ink dark:text-night-ink text-base font-extrabold">
                    التسبحة
                  </p>
                  <p className="text-nav-label dark:text-night-ink/60 text-xs font-bold">
                    أبصلمودية نصف الليل
                  </p>
                </div>
              </div>
              <p className="text-ink/65 dark:text-night-ink/65 mt-2.5 text-right text-[12px] leading-5">
                تسابيح المدائح: الهوسات الأربعة والثيؤطوكيات، وتُقال في نصف
                الليل وقبل القداسات في مواسمها.
              </p>
                <button
                  type="button"
                  aria-pressed={isDone("tasbeha")}
                  onClick={() => toggle("tasbeha")}
                  disabled={!today}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold transition-transform active:scale-95 ${isDone("tasbeha") ? "bg-primary text-white" : "bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink"}`}
                >
                  {isDone("tasbeha") && <CheckIcon className="h-4 w-4" />}
                  {isDone("tasbeha") ? "صلّيت" : "علّم إنك صلّيت"}
                </button>
            </div>
          </div>
        </section>

        <section className="px-6">
          <SectionTitle>ملحوظة</SectionTitle>
          <p className="text-ink/50 dark:text-night-ink/50 px-2 text-[11px] leading-5">
            الترتيب والمعاني بحسب كتاب الأجبية. النصوص الكاملة للصلوات
            والمزامير هتتضاف في نسخة جاية.
          </p>
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
