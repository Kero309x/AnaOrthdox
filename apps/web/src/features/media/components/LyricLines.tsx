import type { LyricLine } from "@/data/tasbehaLyrics";

const splitRepeat = (t: string): { text: string; repeat: string | null } => {
  const m = t.match(/\s*×([٠-٩0-9]+)\s*$/);
  return m ? { text: t.slice(0, m.index), repeat: m[1] } : { text: t, repeat: null };
};

/**
 * Stanza grouping used ONLY when pairing is verified from the source row
 * structure: Coptic line(s) (c=true) belong with the Arabic translation line
 * (c=false) that follows them. Pure presentation grouping — the line data
 * itself is unchanged.
 */
export function groupLyricLines(lines: LyricLine[]): LyricLine[][] {
  const groups: LyricLine[][] = [];
  let pending: LyricLine[] = [];
  for (const line of lines) {
    if (line.r) {
      if (pending.length) {
        groups.push(pending);
        pending = [];
      }
      groups.push([line]);
    } else if (line.c) {
      pending.push(line);
    } else {
      groups.push([...pending, line]);
      pending = [];
    }
  }
  if (pending.length) groups.push(pending);
  return groups;
}

function RubricLine({ text }: { text: string }) {
  return (
    <p dir="rtl" className="text-center">
      <span className="bg-primary/10 text-primary dark:bg-primary/15 inline-block rounded-full px-3 py-1 text-[12px] font-bold">
        توجيه من المصدر: {text}
      </span>
    </p>
  );
}

function VersionLabel({ text }: { text: string }) {
  return (
    <p dir="rtl" className="pt-2 text-center">
      <span className="border-primary/40 text-primary inline-block rounded-full border px-4 py-1 text-[13px] font-extrabold">
        {text}
      </span>
    </p>
  );
}

function LyricP({ line }: { line: LyricLine }) {
  const { text, repeat } = splitRepeat(line.t);
  return (
    <p
      dir="rtl"
      className={
        line.c
          ? "text-primary text-right text-[17px] font-extrabold leading-8"
          : "text-ink dark:text-night-ink text-right text-[16px] font-bold leading-8"
      }
    >
      {text}
      {repeat && (
        <span className="text-ink/50 dark:text-night-ink/50 mt-0.5 block text-[11px] font-bold">
          تتكرر ×{repeat}
        </span>
      )}
    </p>
  );
}

function BlockLabel({ text }: { text: string }) {
  return (
    <p dir="rtl" className="text-ink/50 dark:text-night-ink/50 border-ink/10 dark:border-night-ink/10 border-b pb-1 text-right text-[12px] font-bold">
      {text}
    </p>
  );
}

export function LyricLines({
  lines,
  unevenPairing,
  verifiedPairing,
}: {
  lines: LyricLine[];
  unevenPairing?: boolean;
  verifiedPairing?: boolean;
}) {
  const hasCoptic = lines.some((l) => l.c);
  const hasArabic = lines.some((l) => !l.c && !l.r);

  // Verified source-row pairing: group each Coptic line with its Arabic line.
  if (verifiedPairing || !hasCoptic || !hasArabic) {
    return (
      <div className="space-y-4">
        {groupLyricLines(lines).map((group, gi) => (
          <div key={gi} className="space-y-1.5">
            {group.map((line, li) =>
              line.r ? (
                <RubricLine key={li} text={line.t} />
              ) : line.v ? (
                <VersionLabel key={li} text={line.t} />
              ) : (
                <LyricP key={li} line={line} />
              ),
            )}
          </div>
        ))}
      </div>
    );
  }

  // Unverified or uneven pairing: separate labeled language blocks, never an
  // implied line-by-line correspondence.
  const copticLines = lines.filter((l) => l.c);
  const arabicLines = lines.filter((l) => !l.c);  return (
    <div className="space-y-5">
      <p dir="rtl" className="text-ink/60 dark:text-night-ink/60 rounded-xl bg-ink/5 dark:bg-night-ink/5 px-3 py-2 text-right text-[12px] font-bold leading-6">
        {unevenPairing
          ? "عدد السطور القبطية والعربية في هذا اللحن غير متطابق، فمعروضين في قسمين منفصلين — مفيش اقتران مؤكد سطر بسطر لحد ما يتأكد من المصدر."
          : "اقتران السطور القبطية بالترجمة العربية في هذا اللحن لسه متأكدناش منه من المصدر، فمعروضين في قسمين منفصلين — الترتيب داخل كل قسم زي المصدر."}
      </p>
      <div className="space-y-1.5">
        <BlockLabel text="القبطي (بالحروف العربية)" />
        {copticLines.map((line, li) => (
          <LyricP key={li} line={line} />
        ))}
      </div>
      <div className="space-y-1.5">
        <BlockLabel text="الترجمة العربية" />
        {arabicLines.map((line, li) =>
          line.r ? (
            <RubricLine key={li} text={line.t} />
          ) : line.v ? (
            <VersionLabel key={li} text={line.t} />
          ) : (
            <LyricP key={li} line={line} />
          ),
        )}
      </div>
    </div>
  );
}
