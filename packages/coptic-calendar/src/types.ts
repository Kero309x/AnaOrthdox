/**
 * Ana Orthodox — Coptic Civil Calendar Engine Types
 */

export type CopticMonthId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type CopticMonthCode =
  | "thout"
  | "paopi"
  | "hathor"
  | "koiak"
  | "tobi"
  | "meshir"
  | "paremhat"
  | "parmouti"
  | "pashons"
  | "paoni"
  | "epip"
  | "mesori"
  | "nasie";

export interface CopticMonthInfo {
  id: CopticMonthId;
  code: CopticMonthCode;
  nameAr: string;
  nameEn: string;
  transliteration: string;
  standardLength: number;
  isLeapDependent: boolean;
}

export interface CopticDate {
  year: number;
  month: CopticMonthId;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number; // 1 to 12
  day: number; // 1 to 31
}

export interface CopticDateValidationResult {
  valid: boolean;
  errors: string[];
}

export interface CopticFormatOptions {
  locale?: "ar" | "en";
  digits?: "western" | "eastern";
  includeEra?: boolean;
}
