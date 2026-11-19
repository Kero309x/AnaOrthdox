"use client";

import { localStore } from "@/shared/lib/storage";

import { useEffect, useRef, useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import {
  BookIcon,
  CalendarIcon,
  ChurchIcon,
  CompassIcon,
  CrossIcon,
  MoonIcon,
  MusicIcon,
  StarIcon,
} from "@/shared/ui/icons";
import { toArabicNumber } from "@/domain/calendar/coptic";

const FACES = [
  { key: "cross", Icon: CrossIcon },
  { key: "church", Icon: ChurchIcon },
  { key: "calendar", Icon: CalendarIcon },
  { key: "book", Icon: BookIcon },
  { key: "moon", Icon: MoonIcon },
  { key: "star", Icon: StarIcon },
  { key: "music", Icon: MusicIcon },
  { key: "compass", Icon: CompassIcon },
];

type Card = { id: number; key: string; flipped: boolean; matched: boolean };

function shuffledDeck(): Card[] {
  return [...FACES, ...FACES]
    .map((face, i) => ({ id: i, key: face.key, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
}

// A fully local memory game: no content needed, the faces are the app's own
// icons. Moves and the best score stay on the device.
export default function Memory() {
  const { dark, toggleTheme } = useTheme();
  const [deck, setDeck] = useState<Card[]>(() => shuffledDeck());
  const [firstId, setFirstId] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);
  const flipBack = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = Number(localStore.getItem("memoryBest"));
    if (saved > 0) setBest(saved);
    return () => {
      if (flipBack.current) clearTimeout(flipBack.current);
    };
  }, []);

  function restart() {
    if (flipBack.current) clearTimeout(flipBack.current);
    setDeck(shuffledDeck());
    setFirstId(null);
    setLock(false);
    setMoves(0);
    setWon(false);
  }

  function flip(id: number) {
    if (lock || won) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const next = deck.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setDeck(next);

    if (firstId === null) {
      setFirstId(id);
      return;
    }

    const first = deck.find((c) => c.id === firstId);
    setFirstId(null);
    setMoves((m) => m + 1);

    if (first && first.key === card.key) {
      const matched = next.map((c) =>
        c.key === card.key ? { ...c, matched: true } : c,
      );
      setDeck(matched);
      if (matched.every((c) => c.matched)) {
        setWon(true);
        const total = moves + 1;
        setBest((current) => {
          const nextBest = current === 0 ? total : Math.min(current, total);
          setSaveFailed(!localStore.setItem("memoryBest", String(nextBest)));
          return nextBest;
        });
      }
    } else {
      setLock(true);
      flipBack.current = setTimeout(() => {
        setDeck((current) =>
          current.map((c) =>
            c.id === id || c.id === firstId ? { ...c, flipped: false } : c,
          ),
        );
        setLock(false);
      }, 800);
    }
  }

  const faceOf = (key: string) => FACES.find((f) => f.key === key)!;

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="ذاكرة الصور"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/games"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          ركّز وافتكر أماكن الصور المتشابهة.
        </p>

        <section className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="bg-rose-badge text-primary rounded-full px-4 py-2 text-sm font-extrabold">
              المحاولات: {toArabicNumber(moves)}
            </span>
            {best > 0 && (
              <span className="bg-gold-soft text-gold-ink rounded-full px-4 py-2 text-xs font-extrabold">
                أحسن نتيجة: {toArabicNumber(best)}
              </span>
            )}
            <button
              type="button"
              onClick={restart}
              className="bg-primary rounded-full px-5 py-2 text-sm font-bold text-white transition-transform active:scale-95"
            >
              من الأول
            </button>
          </div>
        </section>

        <section className="px-6 pt-4">
          <div className="grid grid-cols-4 gap-2.5">
            {deck.map((card) => {
              const { Icon } = faceOf(card.key);
              const open = card.flipped || card.matched;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => flip(card.id)}
                  aria-label={open ? `صورة ${card.key}` : "كارت مقفول"}
                  className={`flex aspect-square items-center justify-center rounded-2xl transition-all duration-300 ${
                    open
                      ? card.matched
                        ? "bg-gold-soft"
                        : "bg-white dark:bg-night-card border border-card-border dark:border-card-border-dark"
                      : "bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-3)_100%)] active:scale-95"
                  }`}
                >
                  {open ? (
                    <Icon
                      className={`h-7 w-7 ${card.matched ? "text-gold-ink" : "text-primary"}`}
                    />
                  ) : (
                    <CrossIcon className="h-5 w-5 text-white/40" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {won && (
          <section className="px-6 pt-5">
            <div className="rounded-3xl border border-card-border bg-white p-6 text-center shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
              <p className="text-ink dark:text-night-ink text-2xl font-black">
                برافو! لقيت كل الصور
              </p>
              <p className="text-ink/60 dark:text-night-ink/60 mt-2 text-[13px]">
                خلّصتها في {toArabicNumber(moves)} محاولة.
              </p>
              <button
                type="button"
                onClick={restart}
                className="bg-primary mt-4 rounded-full px-8 py-3 text-sm font-extrabold text-white transition-transform active:scale-95"
              >
                العب تاني
              </button>
            </div>
          </section>
        )}

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          {saveFailed ? "اللعبة شغالة، لكن تعذر حفظ أحسن نتيجة على الجهاز." : "اللعبة شغالة على جهازك بالكامل. حفظ أحسن نتيجة محتاج تخزين متاح على الجهاز."}
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
