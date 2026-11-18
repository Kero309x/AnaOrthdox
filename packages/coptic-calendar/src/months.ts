import { CopticMonthInfo } from "./types";

/**
 * The thirteen months of the Coptic Civil Calendar.
 * Months 1–12 have a fixed length of 30 days.
 * Month 13 (Nasie / The Epagomenal Days) has 5 days in a common year and 6 in a leap year.
 */
export const COPTIC_MONTHS: readonly CopticMonthInfo[] = Object.freeze([
  {
    id: 1,
    code: "thout",
    nameAr: "توت",
    nameEn: "Thout",
    transliteration: "Thout",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 2,
    code: "paopi",
    nameAr: "بابه",
    nameEn: "Paopi",
    transliteration: "Paopi",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 3,
    code: "hathor",
    nameAr: "هاتور",
    nameEn: "Hathor",
    transliteration: "Hathor",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 4,
    code: "koiak",
    nameAr: "كيهك",
    nameEn: "Koiak",
    transliteration: "Kiahk",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 5,
    code: "tobi",
    nameAr: "طوبه",
    nameEn: "Tobi",
    transliteration: "Tubah",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 6,
    code: "meshir",
    nameAr: "أمشير",
    nameEn: "Meshir",
    transliteration: "Amshir",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 7,
    code: "paremhat",
    nameAr: "برمهات",
    nameEn: "Paremhat",
    transliteration: "Baramhat",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 8,
    code: "parmouti",
    nameAr: "برموده",
    nameEn: "Parmouti",
    transliteration: "Baramoudah",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 9,
    code: "pashons",
    nameAr: "بشنس",
    nameEn: "Pashons",
    transliteration: "Bashans",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 10,
    code: "paoni",
    nameAr: "بؤونه",
    nameEn: "Paoni",
    transliteration: "Baounah",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 11,
    code: "epip",
    nameAr: "أبيب",
    nameEn: "Epip",
    transliteration: "Abib",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 12,
    code: "mesori",
    nameAr: "مسرى",
    nameEn: "Mesori",
    transliteration: "Misra",
    standardLength: 30,
    isLeapDependent: false,
  },
  {
    id: 13,
    code: "nasie",
    nameAr: "النسئ",
    nameEn: "Nasie",
    transliteration: "Al-Nasi",
    standardLength: 5,
    isLeapDependent: true,
  },
]);

const MONTH_BY_ID = new Map<number, CopticMonthInfo>(COPTIC_MONTHS.map((m) => [m.id, m]));

const MONTH_BY_CODE = new Map<string, CopticMonthInfo>(COPTIC_MONTHS.map((m) => [m.code, m]));

/**
 * Returns metadata for a given Coptic month ID (1 to 13).
 * Throws a RangeError if the month ID is out of range.
 */
export function getCopticMonthInfo(monthId: number): CopticMonthInfo {
  const info = MONTH_BY_ID.get(monthId);
  if (!info) {
    throw new RangeError(
      `رقم الشهر القبطي غير صالح: ${monthId} (Invalid Coptic month ID: must be between 1 and 13)`
    );
  }
  return info;
}

/**
 * Returns metadata for a given Coptic month machine-readable code.
 */
export function getCopticMonthByCode(code: string): CopticMonthInfo | undefined {
  if (!code || typeof code !== "string") return undefined;
  return MONTH_BY_CODE.get(code.trim().toLowerCase());
}
