import {
  CopticDate,
  CopticDateValidationResult,
  CopticFormatOptions,
  CopticMonthId,
  GregorianDate,
} from "./types";
import { getCopticMonthInfo } from "./months";

/**
 * Fixed day epoch of the Coptic calendar:
 * 1 Thout 1 AM corresponds to Rata Die (R.D.) 103,605.
 * In the Julian calendar, this is 29 August 284 CE.
 * In the proleptic Gregorian calendar, this is also 29 August 284 CE.
 */
export const COPTIC_EPOCH = 103605;

/**
 * Supported Coptic year boundaries
 */
export const MIN_COPTIC_YEAR = 1;
export const MAX_COPTIC_YEAR = 9999;

/**
 * Mathematical floor division that correctly handles negative dividends
 */
export function floorDiv(a: number, b: number): number {
  return Math.floor(a / b);
}

/**
 * Mathematical floor modulo that always returns a non-negative result in [0, b - 1]
 */
export function floorMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/**
 * Determines whether a Coptic year is a leap year.
 * In the Coptic calendar, a year is a leap year if year mod 4 === 3.
 * (e.g. 1743 AM % 4 === 3 -> Leap year with 6 days of Nasie).
 */
export function isCopticLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return floorMod(year, 4) === 3;
}

/**
 * Returns the length in days of a given Coptic month for a given year.
 * Months 1–12 have 30 days.
 * Month 13 (Nasie) has 6 days in a leap year, 5 days in a common year.
 */
export function getCopticMonthLength(year: number, month: number): number {
  if (month >= 1 && month <= 12) {
    return 30;
  }
  if (month === 13) {
    return isCopticLeapYear(year) ? 6 : 5;
  }
  throw new RangeError(
    `رقم الشهر القبطي غير صالح: ${month} (Coptic month must be between 1 and 13)`
  );
}

/**
 * Validates whether a Coptic date is structurally and mathematically sound.
 */
export function validateCopticDate(
  year: number,
  month: number,
  day: number
): CopticDateValidationResult {
  const errors: string[] = [];

  if (!Number.isInteger(year)) {
    errors.push("السنة القبطية يجب أن تكون عدداً صحيحاً (Year must be an integer)");
  } else if (year < MIN_COPTIC_YEAR || year > MAX_COPTIC_YEAR) {
    errors.push(
      `السنة القبطية ${year} خارج النطاق المدعوم [${MIN_COPTIC_YEAR}-${MAX_COPTIC_YEAR}] (Year out of supported range)`
    );
  }

  if (!Number.isInteger(month) || month < 1 || month > 13) {
    errors.push(
      `رقم الشهر القبطي ${month} غير صالح، يجب أن يكون بين 1 و 13 (Month must be between 1 and 13)`
    );
  }

  if (!Number.isInteger(day) || day < 1) {
    errors.push("رقم اليوم يجب أن يكون عدداً صحيحاً موجباً (Day must be positive integer)");
  } else if (Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 13) {
    const maxLength = getCopticMonthLength(year, month);
    if (day > maxLength) {
      if (month === 13 && day === 6) {
        errors.push(
          `اليوم السادس من النسئ غير صالح في السنة ${year} لأنها سنة بسيطة (Day 6 of Nasie is invalid in common year)`
        );
      } else {
        errors.push(
          `اليوم ${day} يتجاوز عدد أيام الشهر القبطي (${maxLength} يوماً) (Day exceeds month length)`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Asserts that a Coptic date is valid, throwing an Error if invalid.
 */
export function assertValidCopticDate(year: number, month: number, day: number): void {
  const check = validateCopticDate(year, month, day);
  if (!check.valid) {
    throw new RangeError(check.errors.join("; "));
  }
}

/**
 * Determines whether a Gregorian year is a leap year per the Gregorian calendar rule:
 * year is divisible by 4, except end-of-century years unless divisible by 400.
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the number of days in a given Gregorian month.
 */
export function getGregorianMonthLength(year: number, month: number): number {
  if (month === 2) {
    return isGregorianLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return 31;
  }
  throw new RangeError(`Invalid Gregorian month: ${month}`);
}

/**
 * Validates a Gregorian calendar date.
 */
export function validateGregorianDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > getGregorianMonthLength(year, month)) return false;
  return true;
}

/**
 * Converts a Coptic date (year, month, day) to a fixed Rata Die day number.
 * Reference: Dershowitz and Reingold, Calendrical Calculations.
 */
export function fixedFromCoptic(year: number, month: number, day: number): number {
  return COPTIC_EPOCH - 1 + 365 * (year - 1) + floorDiv(year, 4) + 30 * (month - 1) + day;
}

/**
 * Converts a fixed Rata Die day number to a Coptic date.
 * Reference: Dershowitz and Reingold, Calendrical Calculations.
 */
export function copticFromFixed(n: number): CopticDate {
  const year = floorDiv(4 * (n - COPTIC_EPOCH) + 1463, 1461);
  const month = floorDiv(n - fixedFromCoptic(year, 1, 1), 30) + 1;
  const day = n + 1 - fixedFromCoptic(year, month, 1);
  return {
    year,
    month: month as CopticMonthId,
    day,
  };
}

/**
 * Converts a Gregorian date (year, month, day) to a fixed Rata Die day number.
 * Day 1 R.D. is January 1, 1 CE Gregorian.
 */
export function fixedFromGregorian(year: number, month: number, day: number): number {
  const m = month;
  const y = year - 1;
  return (
    1 +
    365 * y +
    floorDiv(y, 4) -
    floorDiv(y, 100) +
    floorDiv(y, 400) +
    floorDiv(367 * m - 362, 12) +
    (m <= 2 ? 0 : isGregorianLeapYear(year) ? -1 : -2) +
    day -
    1
  );
}

/**
 * Converts a fixed Rata Die day number to a Gregorian date.
 */
export function gregorianFromFixed(n: number): GregorianDate {
  const d0 = n - 1;
  const n400 = floorDiv(d0, 146097);
  const d1 = floorMod(d0, 146097);
  const n100 = floorDiv(d1, 36524);
  const d2 = floorMod(d1, 36524);
  const n4 = floorDiv(d2, 1461);
  const d3 = floorMod(d2, 1461);
  const n1 = floorDiv(d3, 365);

  let year = 400 * n400 + 100 * n100 + 4 * n4 + n1;
  if (n100 !== 4 && n1 !== 4) {
    year += 1;
  }

  const priorDays = n - fixedFromGregorian(year, 1, 1);
  const correction = n < fixedFromGregorian(year, 3, 1) ? 0 : isGregorianLeapYear(year) ? 1 : 2;
  const month = floorDiv(12 * (priorDays + correction) + 373, 367);
  const day = n - fixedFromGregorian(year, month, 1) + 1;

  return { year, month, day };
}

/**
 * Input format for Gregorian date conversion
 */
export type GregorianDateInput = GregorianDate | Date | string; // ISO format "YYYY-MM-DD"

/**
 * Normalizes any Gregorian date input (Object, JS Date, or ISO string) to a structured GregorianDate.
 * Avoids machine local timezone pollution by parsing date components explicitly or reading UTC values.
 */
export function normalizeGregorianInput(input: GregorianDateInput): GregorianDate {
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
    if (!match) {
      throw new TypeError(
        `تنسيق التاريخ الميلادي غير صالح: "${input}"، يجب أن يكون YYYY-MM-DD (Expected ISO date string YYYY-MM-DD)`
      );
    }
    const year = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10);
    const day = parseInt(match[3]!, 10);
    if (!validateGregorianDate(year, month, day)) {
      throw new RangeError(`تاريخ ميلادي غير صالح: ${input}`);
    }
    return { year, month, day };
  }

  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new TypeError("كائن تاريخ غير صالح (Invalid Date object)");
    }
    return {
      year: input.getUTCFullYear(),
      month: input.getUTCMonth() + 1,
      day: input.getUTCDate(),
    };
  }

  if (typeof input === "object" && input !== null) {
    const { year, month, day } = input as GregorianDate;
    if (!validateGregorianDate(year, month, day)) {
      throw new RangeError(
        `تاريخ ميلادي غير صالح: ${year}-${month}-${day} (Invalid Gregorian date components)`
      );
    }
    return { year, month, day };
  }

  throw new TypeError("نوع مدخل التاريخ غير مدعوم (Unsupported date input type)");
}

/**
 * Converts a Gregorian date to a Coptic date.
 */
export function gregorianToCoptic(input: GregorianDateInput): CopticDate {
  const greg = normalizeGregorianInput(input);
  const fixed = fixedFromGregorian(greg.year, greg.month, greg.day);
  const coptic = copticFromFixed(fixed);
  return coptic;
}

/**
 * Converts a Coptic date to a Gregorian date.
 */
export function copticToGregorian(coptic: CopticDate): GregorianDate {
  assertValidCopticDate(coptic.year, coptic.month, coptic.day);
  const fixed = fixedFromCoptic(coptic.year, coptic.month, coptic.day);
  return gregorianFromFixed(fixed);
}

/**
 * Returns the day of the Coptic year (1 to 365 in common years, 1 to 366 in leap years).
 */
export function getCopticDayOfYear(year: number, month: number, day: number): number {
  assertValidCopticDate(year, month, day);
  return 30 * (month - 1) + day;
}

/**
 * Adds (or subtracts if negative) an integer number of days to a Coptic date.
 */
export function addCopticDays(date: CopticDate, amount: number): CopticDate {
  assertValidCopticDate(date.year, date.month, date.day);
  if (!Number.isInteger(amount)) {
    throw new TypeError("عدد الأيام يجب أن يكون عدداً صحيحاً (Amount must be an integer)");
  }
  const currentFixed = fixedFromCoptic(date.year, date.month, date.day);
  const newFixed = currentFixed + amount;
  return copticFromFixed(newFixed);
}

/**
 * Computes the difference in days between two Coptic dates (a - b).
 */
export function diffCopticDays(a: CopticDate, b: CopticDate): number {
  assertValidCopticDate(a.year, a.month, a.day);
  assertValidCopticDate(b.year, b.month, b.day);
  return fixedFromCoptic(a.year, a.month, a.day) - fixedFromCoptic(b.year, b.month, b.day);
}

/**
 * Compares two Coptic dates.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareCopticDates(a: CopticDate, b: CopticDate): number {
  const diff = diffCopticDays(a, b);
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

const EASTERN_ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Converts western digits (0-9) to Eastern Arabic digits (٠-٩)
 */
export function toEasternArabicDigits(val: number | string): string {
  return String(val).replace(/\d/g, (d) => EASTERN_ARABIC_DIGITS[parseInt(d, 10)]!);
}

/**
 * Formats a Coptic date into a localized, human-readable string.
 */
export function formatCopticDate(date: CopticDate, options: CopticFormatOptions = {}): string {
  assertValidCopticDate(date.year, date.month, date.day);
  const monthInfo = getCopticMonthInfo(date.month);
  const locale = options.locale || "ar";
  const digits = options.digits || (locale === "ar" ? "eastern" : "western");
  const includeEra = options.includeEra ?? true;

  if (locale === "ar") {
    const dayStr = digits === "eastern" ? toEasternArabicDigits(date.day) : String(date.day);
    const yearStr = digits === "eastern" ? toEasternArabicDigits(date.year) : String(date.year);
    const eraStr = includeEra ? " ش" : "";
    return `${dayStr} ${monthInfo.nameAr} ${yearStr}${eraStr}`;
  }

  const dayStr = String(date.day);
  const yearStr = String(date.year);
  const eraStr = includeEra ? " AM" : "";
  return `${dayStr} ${monthInfo.nameEn} ${yearStr}${eraStr}`;
}
