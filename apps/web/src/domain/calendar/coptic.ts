import { fixedFromGregorian, gregorianFromFixed, fixedFromCoptic, gregorianToCoptic as convert, getCopticMonthLength } from '@ana-orthodox/coptic-calendar';
export type CopticDate = { year: number; month: number; day: number };
const JDN_OFFSET = 1721425;
export function gregorianToJd(y: number, m: number, d: number) { return fixedFromGregorian(y,m,d) + JDN_OFFSET; }
export function jdToGregorian(jd: number) { const x = gregorianFromFixed(jd-JDN_OFFSET); return {y:x.year,m:x.month,d:x.day}; }
export function copticToJd(y: number,m: number,d: number) { return fixedFromCoptic(y,m,d) + JDN_OFFSET; }
export function gregorianToCoptic(y: number,m: number,d: number): CopticDate { return convert({year:y,month:m,day:d}); }
export const copticMonthLength = getCopticMonthLength;

export const COPTIC_MONTHS = [
  "توت",
  "بابه",
  "هاتور",
  "كيهك",
  "طوبة",
  "أمشير",
  "برمهات",
  "برمودة",
  "بشنس",
  "بؤونه",
  "أبيب",
  "مسرى",
  "نسيء",
] as const;

// Fixed occasions only, keyed "month-day". Movable feasts and fasts (الصوم
// الكبير، القيامة، الصعود، العنصرة، صوم الرسل) change every year and are
// intentionally left out until a liturgical data source exists.
export type Occasion = { label: string; kind: "feast" | "fast" };

export const OCCASIONS: Record<string, Occasion> = {
  "1-1": { label: "عيد النيروز، رأس السنة القبطية", kind: "feast" },
  "1-17": { label: "عيد الصليب المقدس", kind: "feast" },
  "3-16": { label: "بدء صوم الميلاد", kind: "fast" },
  "4-3": { label: "عيد دخول السيدة العذراء الهيكل", kind: "feast" },
  "4-29": { label: "عيد الميلاد المجيد", kind: "feast" },
  "5-11": { label: "عيد الغطاس المجيد", kind: "feast" },
  "5-21": { label: "عيد نياحة السيدة العذراء", kind: "feast" },
  "8-29": { label: "عيد البشارة", kind: "feast" },
  "9-1": { label: "عيد ميلاد السيدة العذراء", kind: "feast" },
  "9-24": { label: "عيد دخول العائلة المقدسة أرض مصر", kind: "feast" },
  "12-1": { label: "بدء صوم السيدة العذراء", kind: "fast" },
  "12-16": { label: "عيد صعود جسد السيدة العذراء", kind: "feast" },
};

const arabicDigits = new Intl.NumberFormat("ar-EG", { useGrouping: false });

export function toArabicNumber(value: number): string {
  return arabicDigits.format(value);
}

export function formatCopticDate({ year, month, day }: CopticDate): string {
  return `${toArabicNumber(day)} ${COPTIC_MONTHS[month - 1]} ${toArabicNumber(year)} ش`;
}
