"use client";

import { localStore } from "@/shared/lib/storage";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { LightbulbIcon, RestartIcon, TimerIcon } from "@/shared/ui/icons";
import { toArabicNumber } from "@/domain/calendar/coptic";

// Fifteen original questions, all grounded in the app's own content: the
// Coptic calendar data in coptic.ts and the Agpeya structure in Prayers.tsx.
const QUESTIONS: { q: string; options: string[]; answer: number }[] = [
  {
    q: "السنة القبطية فيها كام شهر؟",
    options: ["١٢ شهر", "١٣ شهر", "١٠ شهور", "١٤ شهر"],
    answer: 1,
  },
  {
    q: "كل شهر قبطي كامل فيه كام يوم؟",
    options: ["٢٨ يوم", "٣١ يوم", "٣٠ يوم", "٢٩ يوم"],
    answer: 2,
  },
  {
    q: "إيه اسم الشهر الصغير في آخر السنة القبطية؟",
    options: ["بؤونه", "هاتور", "مسرى", "نسيء"],
    answer: 3,
  },
  {
    q: "شهر نسيء في السنة البسيطة فيه كام يوم؟",
    options: ["٥ أيام", "٧ أيام", "١٠ أيام", "٣ أيام"],
    answer: 0,
  },
  {
    q: "أول شهور السنة القبطية هو إيه؟",
    options: ["بابه", "توت", "طوبة", "برمهات"],
    answer: 1,
  },
  {
    q: "عيد النيروز هو إيه؟",
    options: [
      "عيد القيامة المجيد",
      "عيد الغطاس",
      "رأس السنة القبطية",
      "بداية الصوم الكبير",
    ],
    answer: 2,
  },
  {
    q: "الأجبية (كتاب السواعي) فيها كام صلاة مرتبة على مدار اليوم؟",
    options: ["٧ صلوات", "٣ صلوات", "٥ صلوات", "١٠ صلوات"],
    answer: 0,
  },
  {
    q: "صلاة باكر بتتقال امتى؟",
    options: ["٩ صباحاً", "مع طلوع الفجر", "قبل النوم", "منتصف الليل"],
    answer: 1,
  },
  {
    q: "الساعة التاسعة في الأجبية بتفتكر إيه؟",
    options: [
      "حلول الروح القدس",
      "صلب السيد المسيح",
      "قيامة السيد المسيح",
      "وفاة السيد المسيح بالجسد على الصليب",
    ],
    answer: 3,
  },
  {
    q: "التسبحة مرتبطة بأنهي وقت في اليوم؟",
    options: ["الغروب", "الظهر", "نصف الليل", "الفجر"],
    answer: 2,
  },
  {
    q: "عيد الميلاد المجيد بيوافق ٢٩ من أنهي شهر قبطي؟",
    options: ["هاتور", "كيهك", "طوبة", "بابه"],
    answer: 1,
  },
  {
    q: "عيد الغطاس المجيد بيوافق ١١ من أنهي شهر؟",
    options: ["أمشير", "كيهك", "طوبة", "توت"],
    answer: 2,
  },
  {
    q: "صوم السيدة العذراء بيبدأ في أول أنهي شهر؟",
    options: ["مسرى", "بشنس", "أبيب", "برمودة"],
    answer: 0,
  },
  {
    q: "التقويم القبطي بيسمّي سنينه باسم إيه؟",
    options: [
      "سنة الفداء",
      "سنة الشهداء",
      "السنة الهجرية",
      "سنة الكنيسة الأولى",
    ],
    answer: 1,
  },
  {
    q: "عيد صعود جسد السيدة العذراء بيوافق ١٦ من أنهي شهر؟",
    options: ["برمودة", "بشنس", "نسيء", "مسرى"],
    answer: 3,
  },
];

const LETTERS = ["أ", "ب", "ج", "د"];
const TOTAL_TIME = 300; // five minutes for the whole ladder
const HINTS_PER_RUN = 3;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${toArabicNumber(m)}:${toArabicNumber(s).padStart(2, "٠")}`;
}

type Phase = "playing" | "over" | "won";

export default function Quiz() {
  const { dark, toggleTheme } = useTheme();
  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME);
  const [hintsLeft, setHintsLeft] = useState(HINTS_PER_RUN);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = Number(localStore.getItem("quizBest"));
    if (saved > 0) setBest(saved);
  }, []);

  const finish = useCallback(
    (reached: number, won: boolean) => {
      setPhase(won ? "won" : "over");
      const record = Math.max(reached, won ? QUESTIONS.length : 0);
      setBest((current) => {
        const next = Math.max(current, record);
        setSaveFailed(!localStore.setItem("quizBest", String(next)));
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          finish(level, false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, level, finish]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setLevel(0);
    setPhase("playing");
    setSecondsLeft(TOTAL_TIME);
    setHintsLeft(HINTS_PER_RUN);
    setDisabledOptions([]);
    setPicked(null);
  }

  function choose(index: number) {
    if (phase !== "playing" || picked !== null) return;
    if (disabledOptions.includes(index)) return;
    setPicked(index);
    const question = QUESTIONS[level];
    if (index === question.answer) {
      advanceTimer.current = setTimeout(() => {
        const nextLevel = level + 1;
        setPicked(null);
        setDisabledOptions([]);
        if (nextLevel >= QUESTIONS.length) {
          finish(nextLevel, true);
        } else {
          setLevel(nextLevel);
        }
      }, 500);
    } else {
      advanceTimer.current = setTimeout(() => finish(level, false), 700);
    }
  }

  function useHint() {
    if (phase !== "playing" || hintsLeft === 0 || picked !== null) return;
    const question = QUESTIONS[level];
    const wrong = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.answer && !disabledOptions.includes(i));
    if (wrong.length === 0) return;
    const remove = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setDisabledOptions((current) => [...current, ...remove]);
    setHintsLeft((current) => current - 1);
  }

  const question = QUESTIONS[Math.min(level, QUESTIONS.length - 1)];

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="سلّم الأسئلة"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/games"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          مسابقة بسُلّم مستويات ومساعدات.
        </p>

        {/* Toolbar: timer, restart, hint */}
        <section className="px-6 pt-4">
          <div className="flex items-center justify-center gap-3">
            <span className="bg-rose-badge text-primary flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold" dir="ltr">
              <TimerIcon className="h-4 w-4" />
              {formatTime(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={restart}
              aria-label="إعادة من الأول"
              className="bg-rose-badge text-primary flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
            >
              <RestartIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={useHint}
              disabled={phase !== "playing" || hintsLeft === 0}
              aria-label={`مساعدة، باقي ${toArabicNumber(hintsLeft)}`}
              className="bg-rose-badge text-primary relative flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-40"
            >
              <LightbulbIcon className="h-5 w-5" />
              <span className="bg-primary absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white">
                {toArabicNumber(hintsLeft)}
              </span>
            </button>
          </div>
        </section>

        {phase === "playing" ? (
          <section className="px-6 pt-4">
            <div className="flex gap-3" dir="ltr">
              {/* Ladder: ١٥ at the top down to ١, completed rungs filled. */}
              <div className="flex flex-col-reverse gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`flex h-7 w-9 items-center justify-center rounded-full text-[11px] font-black ${
                      i === level
                        ? "bg-gold-soft text-gold-ink ring-2 ring-gold-ink"
                        : i < level
                          ? "bg-primary text-white"
                          : "bg-rose-badge text-primary/70"
                    }`}
                  >
                    {toArabicNumber(i + 1)}
                  </span>
                ))}
              </div>
              <div className="flex-1" dir="rtl">
                <div className="rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
                  <p className="text-primary dark:text-rose text-right text-[11px] font-extrabold">
                    المستوى {toArabicNumber(level + 1)} من{" "}
                    {toArabicNumber(QUESTIONS.length)}
                  </p>
                  <p className="text-ink dark:text-night-ink mt-2 text-right text-[16px] leading-7 font-black">
                    {question.q}
                  </p>
                </div>
                <div className="mt-3 space-y-2.5">
                  {question.options.map((option, i) => {
                    const isPicked = picked === i;
                    const isRight = isPicked && i === question.answer;
                    const isWrong = isPicked && i !== question.answer;
                    const isDisabled = disabledOptions.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => choose(i)}
                        disabled={isDisabled || picked !== null}
                        className={`flex w-full items-center gap-3 rounded-full border px-4 py-3 text-right text-[14px] font-bold transition-colors ${
                          isRight
                            ? "border-primary bg-primary text-white"
                            : isWrong
                              ? "border-primary bg-rose-badge text-primary line-through"
                              : isDisabled
                                ? "border-card-border bg-white opacity-35 dark:border-card-border-dark dark:bg-night-card"
                                : "border-card-border bg-white hover:border-rose dark:border-card-border-dark dark:bg-night-card"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                            isRight
                              ? "bg-white text-primary"
                              : "bg-rose-badge text-primary"
                          }`}
                        >
                          {LETTERS[i]}
                        </span>
                        <span className="text-ink flex-1 dark:text-night-ink">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-6 pt-6">
            <div className="rounded-3xl border border-card-border bg-white p-6 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
              <p className="text-ink dark:text-night-ink text-2xl font-black">
                {phase === "won" ? "كملت السلم كله!" : "خلصت المحاولة"}
              </p>
              <p className="text-ink/60 dark:text-night-ink/60 mt-2 text-[13px] leading-6">
                {phase === "won"
                  ? "إجابات صحيحة في المستويات الـ ١٥ كلها. برافو عليك!"
                  : secondsLeft === 0
                    ? "الوقت خلص. وصلت للمستوى " + toArabicNumber(Math.max(level, 1)) + "."
                    : "إجابة غلط بتنزّل من السلم. وصلت للمستوى " + toArabicNumber(Math.max(level, 1)) + "."}
              </p>
              {best > 0 && (
                <p className="bg-gold-soft text-gold-ink mx-auto mt-3 w-fit rounded-full px-4 py-1.5 text-xs font-extrabold">
                  أحسن مستوى على جهازك: {toArabicNumber(best)}
                </p>
              )}
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="bg-primary rounded-full px-8 py-3 text-sm font-extrabold text-white transition-transform active:scale-95"
                >
                  {phase === "won" ? "العب تاني" : "حاول تاني"}
                </button>
                <Link
                  href="/games"
                  className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full px-8 py-3 text-sm font-bold transition-transform active:scale-95"
                >
                  رجوع للألعاب
                </Link>
              </div>
            </div>
          </section>
        )}

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          الأسئلة من محتوى التطبيق نفسه: التقويم القبطي وترتيب الأجبية.
          {saveFailed ? " تعذر حفظ أحسن مستوى على الجهاز." : " حفظ أحسن مستوى محتاج تخزين متاح على الجهاز."}
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
