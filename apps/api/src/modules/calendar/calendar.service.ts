import { BadRequestException, Injectable } from "@nestjs/common";
import {
  copticToGregorian,
  formatCopticDate,
  getCopticDayOfYear,
  getCopticMonthInfo,
  gregorianToCoptic,
  isCopticLeapYear,
  validateCopticDate,
  CopticMonthId,
} from "@ana-orthodox/coptic-calendar";
import { CalendarConversionResponseDto } from "@ana-orthodox/shared-types";

@Injectable()
export class CalendarService {
  /**
   * Converts a Gregorian date (YYYY-MM-DD) to its exact Coptic civil date
   */
  fromGregorian(dateStr: string): CalendarConversionResponseDto {
    try {
      const coptic = gregorianToCoptic(dateStr);
      const monthInfo = getCopticMonthInfo(coptic.month);
      const isLeap = isCopticLeapYear(coptic.year);
      const dayOfYear = getCopticDayOfYear(coptic.year, coptic.month, coptic.day);

      // Extract validated Gregorian components
      const parts = dateStr.split("-").map((p) => parseInt(p, 10));
      const gregYear = parts[0]!;
      const gregMonth = parts[1]!;
      const gregDay = parts[2]!;

      return {
        coptic: {
          year: coptic.year,
          month: coptic.month,
          monthCode: monthInfo.code,
          monthNameAr: monthInfo.nameAr,
          monthNameEn: monthInfo.nameEn,
          day: coptic.day,
          dayOfYear,
          isLeapYear: isLeap,
        },
        gregorian: {
          iso: dateStr,
          year: gregYear,
          month: gregMonth,
          day: gregDay,
        },
        formatted: {
          ar: formatCopticDate(coptic, { locale: "ar", digits: "eastern" }),
          en: formatCopticDate(coptic, { locale: "en", digits: "western" }),
        },
      };
    } catch (err: any) {
      throw new BadRequestException(
        err.message || "تاريخ ميلادي غير صالح (Invalid Gregorian date)"
      );
    }
  }

  /**
   * Converts a Coptic date (year, month, day) to its exact Gregorian civil date
   */
  toGregorian(year: number, month: number, day: number): CalendarConversionResponseDto {
    const validation = validateCopticDate(year, month, day);
    if (!validation.valid) {
      throw new BadRequestException({
        message: "تاريخ قبطي غير صالح (Invalid Coptic date)",
        errors: validation.errors,
      });
    }

    try {
      const copticMonth = month as CopticMonthId;
      const greg = copticToGregorian({ year, month: copticMonth, day });
      const monthInfo = getCopticMonthInfo(copticMonth);
      const isLeap = isCopticLeapYear(year);
      const dayOfYear = getCopticDayOfYear(year, copticMonth, day);

      const pad = (n: number) => String(n).padStart(2, "0");
      const iso = `${greg.year}-${pad(greg.month)}-${pad(greg.day)}`;

      return {
        coptic: {
          year,
          month: copticMonth,
          monthCode: monthInfo.code,
          monthNameAr: monthInfo.nameAr,
          monthNameEn: monthInfo.nameEn,
          day,
          dayOfYear,
          isLeapYear: isLeap,
        },
        gregorian: {
          iso,
          year: greg.year,
          month: greg.month,
          day: greg.day,
        },
        formatted: {
          ar: formatCopticDate(
            { year, month: copticMonth, day },
            { locale: "ar", digits: "eastern" }
          ),
          en: formatCopticDate(
            { year, month: copticMonth, day },
            { locale: "en", digits: "western" }
          ),
        },
      };
    } catch (err: any) {
      throw new BadRequestException(
        err.message || "فشل التحويل إلى التاريخ الميلادي (Failed to convert Coptic date)"
      );
    }
  }
}
