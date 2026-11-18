import { describe, it } from "node:test";
import assert from "node:assert";
import {
  COPTIC_MONTHS,
  getCopticMonthInfo,
  getCopticMonthByCode,
  isCopticLeapYear,
  getCopticMonthLength,
  validateCopticDate,
  assertValidCopticDate,
  isGregorianLeapYear,
  fixedFromCoptic,
  copticFromFixed,
  gregorianFromFixed,
  gregorianToCoptic,
  copticToGregorian,
  getCopticDayOfYear,
  addCopticDays,
  diffCopticDays,
  compareCopticDates,
  formatCopticDate,
  COPTIC_EPOCH,
} from "./index";

describe("Coptic Civil Calendar Engine Suite", () => {
  describe("Month Registry & Structure", () => {
    it("should register exactly thirteen Coptic months with correct IDs and properties", () => {
      assert.strictEqual(COPTIC_MONTHS.length, 13);
      for (let i = 0; i < 12; i++) {
        const m = COPTIC_MONTHS[i]!;
        assert.strictEqual(m.id, i + 1);
        assert.strictEqual(m.standardLength, 30);
        assert.strictEqual(m.isLeapDependent, false);
      }

      // Month 13 is Nasie
      const nasie = COPTIC_MONTHS[12]!;
      assert.strictEqual(nasie.id, 13);
      assert.strictEqual(nasie.code, "nasie");
      assert.strictEqual(nasie.nameAr, "النسئ");
      assert.strictEqual(nasie.nameEn, "Nasie");
      assert.strictEqual(nasie.standardLength, 5);
      assert.strictEqual(nasie.isLeapDependent, true);
    });

    it("should retrieve month info by ID and reject invalid IDs", () => {
      const thout = getCopticMonthInfo(1);
      assert.strictEqual(thout.code, "thout");
      assert.strictEqual(thout.nameAr, "توت");

      const mesori = getCopticMonthInfo(12);
      assert.strictEqual(mesori.code, "mesori");
      assert.strictEqual(mesori.nameAr, "مسرى");

      assert.throws(() => getCopticMonthInfo(0), RangeError);
      assert.throws(() => getCopticMonthInfo(14), RangeError);
    });

    it("should retrieve month info by machine code", () => {
      const hathor = getCopticMonthByCode("hathor");
      assert.ok(hathor);
      assert.strictEqual(hathor.id, 3);

      const koiak = getCopticMonthByCode("KOIAK");
      assert.ok(koiak);
      assert.strictEqual(koiak.id, 4);

      assert.strictEqual(getCopticMonthByCode("invalid"), undefined);
    });
  });

  describe("Coptic Leap-Year Arithmetic", () => {
    it("should correctly identify leap years (year mod 4 === 3)", () => {
      // 1743 AM is a leap year (1743 % 4 === 3)
      assert.strictEqual(isCopticLeapYear(1743), true);

      // 1744 AM is a common year (1744 % 4 === 0)
      assert.strictEqual(isCopticLeapYear(1744), false);

      // 1745 AM is a common year (1745 % 4 === 1)
      assert.strictEqual(isCopticLeapYear(1745), false);

      // 1746 AM is a common year (1746 % 4 === 2)
      assert.strictEqual(isCopticLeapYear(1746), false);

      // 1747 AM is a leap year (1747 % 4 === 3)
      assert.strictEqual(isCopticLeapYear(1747), true);

      // Year 3 AM is a leap year; 1, 2, 4 AM are common years
      assert.strictEqual(isCopticLeapYear(1), false);
      assert.strictEqual(isCopticLeapYear(2), false);
      assert.strictEqual(isCopticLeapYear(3), true);
      assert.strictEqual(isCopticLeapYear(4), false);
    });

    it("should return 5 days for Nasie in common years and 6 in leap years", () => {
      assert.strictEqual(getCopticMonthLength(1743, 13), 6);
      assert.strictEqual(getCopticMonthLength(1744, 13), 5);
      assert.strictEqual(getCopticMonthLength(1745, 13), 5);
      assert.strictEqual(getCopticMonthLength(1746, 13), 5);
      assert.strictEqual(getCopticMonthLength(1747, 13), 6);

      // Regular months always 30
      for (let m = 1; m <= 12; m++) {
        assert.strictEqual(getCopticMonthLength(1743, m), 30);
        assert.strictEqual(getCopticMonthLength(1744, m), 30);
      }
    });
  });

  describe("Coptic Date Validation & Boundaries", () => {
    it("should validate sound Coptic dates", () => {
      assert.strictEqual(validateCopticDate(1743, 1, 1).valid, true);
      assert.strictEqual(validateCopticDate(1743, 1, 30).valid, true);
      assert.strictEqual(validateCopticDate(1743, 13, 6).valid, true); // Leap year
      assert.strictEqual(validateCopticDate(1744, 13, 5).valid, true); // Common year
    });

    it("should reject invalid Coptic dates with precise diagnostic errors", () => {
      // Day 31 in standard 30-day month
      const check31 = validateCopticDate(1743, 1, 31);
      assert.strictEqual(check31.valid, false);
      assert.ok(check31.errors.some((e) => e.includes("30")));

      // Day 6 of Nasie in a common year
      const checkNasie6Common = validateCopticDate(1744, 13, 6);
      assert.strictEqual(checkNasie6Common.valid, false);
      assert.ok(checkNasie6Common.errors.some((e) => e.includes("بسيطة")));

      // Day 7 of Nasie even in a leap year
      const checkNasie7Leap = validateCopticDate(1743, 13, 7);
      assert.strictEqual(checkNasie7Leap.valid, false);

      // Day 0
      assert.strictEqual(validateCopticDate(1743, 1, 0).valid, false);

      // Month 14
      assert.strictEqual(validateCopticDate(1743, 14, 1).valid, false);

      // Year out of range
      assert.strictEqual(validateCopticDate(0, 1, 1).valid, false);
      assert.strictEqual(validateCopticDate(10000, 1, 1).valid, false);
    });

    it("assertValidCopticDate should throw RangeError for invalid dates", () => {
      assert.doesNotThrow(() => assertValidCopticDate(1743, 1, 1));
      assert.throws(() => assertValidCopticDate(1744, 13, 6), RangeError);
    });
  });

  describe("Mandatory Reference Cases (Section 6)", () => {
    it("1 Thout 1743 AM = 11 September 2026", () => {
      const greg = copticToGregorian({ year: 1743, month: 1, day: 1 });
      assert.deepStrictEqual(greg, { year: 2026, month: 9, day: 11 });

      const coptic = gregorianToCoptic({ year: 2026, month: 9, day: 11 });
      assert.deepStrictEqual(coptic, { year: 1743, month: 1, day: 1 });
    });

    it("30 Thout 1743 AM = 10 October 2026", () => {
      const greg = copticToGregorian({ year: 1743, month: 1, day: 30 });
      assert.deepStrictEqual(greg, { year: 2026, month: 10, day: 10 });

      const coptic = gregorianToCoptic({ year: 2026, month: 10, day: 10 });
      assert.deepStrictEqual(coptic, { year: 1743, month: 1, day: 30 });
    });

    it("29 Koiak 1743 AM = 7 January 2027 (Coptic Nativity)", () => {
      const greg = copticToGregorian({ year: 1743, month: 4, day: 29 });
      assert.deepStrictEqual(greg, { year: 2027, month: 1, day: 7 });

      const coptic = gregorianToCoptic({ year: 2027, month: 1, day: 7 });
      assert.deepStrictEqual(coptic, { year: 1743, month: 4, day: 29 });
    });

    it("1743 AM is a leap year", () => {
      assert.strictEqual(isCopticLeapYear(1743), true);
    });

    it("6 Nasie 1743 AM = 11 September 2027", () => {
      const greg = copticToGregorian({ year: 1743, month: 13, day: 6 });
      assert.deepStrictEqual(greg, { year: 2027, month: 9, day: 11 });

      const coptic = gregorianToCoptic({ year: 2027, month: 9, day: 11 });
      assert.deepStrictEqual(coptic, { year: 1743, month: 13, day: 6 });
    });

    it("1 Thout 1744 AM follows the final day of 1743 AM (12 September 2027)", () => {
      const gregNext = copticToGregorian({ year: 1744, month: 1, day: 1 });
      assert.deepStrictEqual(gregNext, { year: 2027, month: 9, day: 12 });

      const copticNext = gregorianToCoptic({ year: 2027, month: 9, day: 12 });
      assert.deepStrictEqual(copticNext, { year: 1744, month: 1, day: 1 });

      // Verifying arithmetic continuity: 6 Nasie 1743 + 1 day = 1 Thout 1744
      const nextDay = addCopticDays({ year: 1743, month: 13, day: 6 }, 1);
      assert.deepStrictEqual(nextDay, { year: 1744, month: 1, day: 1 });
    });
  });

  describe("Epoch & Historical Baseline", () => {
    it("1 Thout 1 AM corresponds to R.D. 103,605 and 29 August 284 CE", () => {
      const fixed = fixedFromCoptic(1, 1, 1);
      assert.strictEqual(fixed, COPTIC_EPOCH);

      const coptic = copticFromFixed(COPTIC_EPOCH);
      assert.deepStrictEqual(coptic, { year: 1, month: 1, day: 1 });

      const greg = gregorianFromFixed(COPTIC_EPOCH);
      assert.deepStrictEqual(greg, { year: 284, month: 8, day: 29 });
    });
  });

  describe("Full-Year Round-Trip & Continuous Invariance", () => {
    it("every single day of a leap year (1743 AM, 366 days) must round-trip exactly", () => {
      let daysCounted = 0;
      for (let m = 1; m <= 13; m++) {
        const daysInMonth = getCopticMonthLength(1743, m);
        for (let d = 1; d <= daysInMonth; d++) {
          daysCounted++;
          const copticOrig = { year: 1743, month: m as any, day: d };
          const greg = copticToGregorian(copticOrig);
          const copticBack = gregorianToCoptic(greg);
          assert.deepStrictEqual(copticBack, copticOrig);

          // Day of year verification
          const doy = getCopticDayOfYear(1743, m, d);
          assert.strictEqual(doy, daysCounted);
        }
      }
      assert.strictEqual(daysCounted, 366);
    });

    it("every single day of a common year (1744 AM, 365 days) must round-trip exactly", () => {
      let daysCounted = 0;
      for (let m = 1; m <= 13; m++) {
        const daysInMonth = getCopticMonthLength(1744, m);
        for (let d = 1; d <= daysInMonth; d++) {
          daysCounted++;
          const copticOrig = { year: 1744, month: m as any, day: d };
          const greg = copticToGregorian(copticOrig);
          const copticBack = gregorianToCoptic(greg);
          assert.deepStrictEqual(copticBack, copticOrig);

          const doy = getCopticDayOfYear(1744, m, d);
          assert.strictEqual(doy, daysCounted);
        }
      }
      assert.strictEqual(daysCounted, 365);
    });

    it("consecutive Coptic days map to strictly consecutive fixed days", () => {
      let prevFixed = fixedFromCoptic(1743, 1, 1);
      for (let dayOffset = 1; dayOffset <= 400; dayOffset++) {
        const nextCoptic = addCopticDays({ year: 1743, month: 1, day: 1 }, dayOffset);
        const nextFixed = fixedFromCoptic(nextCoptic.year, nextCoptic.month, nextCoptic.day);
        assert.strictEqual(nextFixed, prevFixed + 1);
        prevFixed = nextFixed;
      }
    });
  });

  describe("Gregorian Century Boundaries & Intercalation", () => {
    it("handles Gregorian non-leap century year (1900)", () => {
      assert.strictEqual(isGregorianLeapYear(1900), false);
      const coptic = gregorianToCoptic({ year: 1900, month: 2, day: 28 });
      const nextCoptic = gregorianToCoptic({ year: 1900, month: 3, day: 1 });
      assert.strictEqual(diffCopticDays(nextCoptic, coptic), 1);
    });

    it("handles Gregorian leap century year (2000)", () => {
      assert.strictEqual(isGregorianLeapYear(2000), true);
      const feb29 = gregorianToCoptic({ year: 2000, month: 2, day: 29 });
      const gregBack = copticToGregorian(feb29);
      assert.deepStrictEqual(gregBack, { year: 2000, month: 2, day: 29 });
    });
  });

  describe("Timezone Independence & Input Normalization", () => {
    it("produces identical conversion whether input is ISO string, object, or Date", () => {
      const fromObject = gregorianToCoptic({ year: 2026, month: 9, day: 11 });
      const fromString = gregorianToCoptic("2026-09-11");
      const fromDate = gregorianToCoptic(new Date(Date.UTC(2026, 8, 11)));

      assert.deepStrictEqual(fromObject, { year: 1743, month: 1, day: 1 });
      assert.deepStrictEqual(fromString, { year: 1743, month: 1, day: 1 });
      assert.deepStrictEqual(fromDate, { year: 1743, month: 1, day: 1 });
    });

    it("rejects malformed string inputs", () => {
      assert.throws(() => gregorianToCoptic("2026/09/11"), TypeError);
      assert.throws(() => gregorianToCoptic("invalid-date"), TypeError);
      assert.throws(() => gregorianToCoptic("2026-02-31"), RangeError);
    });
  });

  describe("Date Arithmetic & Comparisons", () => {
    it("correctly computes addCopticDays and diffCopticDays across month and year boundaries", () => {
      const start = { year: 1743, month: 12 as const, day: 30 }; // 30 Mesori
      const plusOne = addCopticDays(start, 1);
      assert.deepStrictEqual(plusOne, { year: 1743, month: 13, day: 1 }); // 1 Nasie

      const plusSeven = addCopticDays(start, 7);
      assert.deepStrictEqual(plusSeven, { year: 1744, month: 1, day: 1 }); // 1 Thout 1744

      const diff = diffCopticDays(plusSeven, start);
      assert.strictEqual(diff, 7);

      const negDiff = diffCopticDays(start, plusSeven);
      assert.strictEqual(negDiff, -7);
    });

    it("correctly compares Coptic dates", () => {
      const d1 = { year: 1743, month: 1 as const, day: 1 };
      const d2 = { year: 1743, month: 1 as const, day: 2 };
      const d3 = { year: 1744, month: 1 as const, day: 1 };

      assert.strictEqual(compareCopticDates(d1, d2), -1);
      assert.strictEqual(compareCopticDates(d2, d1), 1);
      assert.strictEqual(compareCopticDates(d1, d1), 0);
      assert.strictEqual(compareCopticDates(d1, d3), -1);
      assert.strictEqual(compareCopticDates(d3, d1), 1);
    });
  });

  describe("Formatting", () => {
    it("formats Arabic Coptic dates with Eastern Arabic digits by default", () => {
      const date = { year: 1743, month: 1 as const, day: 1 };
      const formatted = formatCopticDate(date, { locale: "ar" });
      assert.strictEqual(formatted, "١ توت ١٧٤٣ ش");

      const westernDigits = formatCopticDate(date, { locale: "ar", digits: "western" });
      assert.strictEqual(westernDigits, "1 توت 1743 ش");
    });

    it("formats English Coptic dates with Western digits and AM era", () => {
      const date = { year: 1743, month: 4 as const, day: 29 };
      const formatted = formatCopticDate(date, { locale: "en" });
      assert.strictEqual(formatted, "29 Koiak 1743 AM");

      const noEra = formatCopticDate(date, { locale: "en", includeEra: false });
      assert.strictEqual(noEra, "29 Koiak 1743");
    });
  });
});
