import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { BadRequestException } from "@nestjs/common";
import { CalendarService } from "./calendar.service";

describe("CalendarService Unit Suite", () => {
  let service: CalendarService;

  beforeEach(() => {
    service = new CalendarService();
  });

  describe("fromGregorian", () => {
    it("should convert Gregorian 2026-09-11 to 1 Thout 1743 AM (leap year)", () => {
      const res = service.fromGregorian("2026-09-11");
      assert.strictEqual(res.coptic.year, 1743);
      assert.strictEqual(res.coptic.month, 1);
      assert.strictEqual(res.coptic.day, 1);
      assert.strictEqual(res.coptic.monthCode, "thout");
      assert.strictEqual(res.coptic.monthNameAr, "توت");
      assert.strictEqual(res.coptic.monthNameEn, "Thout");
      assert.strictEqual(res.coptic.dayOfYear, 1);
      assert.strictEqual(res.coptic.isLeapYear, true);
      assert.strictEqual(res.formatted.ar, "١ توت ١٧٤٣ ش");
      assert.strictEqual(res.formatted.en, "1 Thout 1743 AM");
    });

    it("should convert Gregorian 2027-01-07 to 29 Koiak 1743 AM (Nativity)", () => {
      const res = service.fromGregorian("2027-01-07");
      assert.strictEqual(res.coptic.year, 1743);
      assert.strictEqual(res.coptic.month, 4);
      assert.strictEqual(res.coptic.day, 29);
      assert.strictEqual(res.coptic.monthCode, "koiak");
    });

    it("should convert Gregorian 2027-09-11 to 6 Nasie 1743 AM (Leap Day)", () => {
      const res = service.fromGregorian("2027-09-11");
      assert.strictEqual(res.coptic.year, 1743);
      assert.strictEqual(res.coptic.month, 13);
      assert.strictEqual(res.coptic.day, 6);
      assert.strictEqual(res.coptic.dayOfYear, 366);
    });

    it("should throw BadRequestException on invalid Gregorian date string", () => {
      assert.throws(() => service.fromGregorian("invalid-date"), BadRequestException);
      assert.throws(() => service.fromGregorian("2026-02-31"), BadRequestException);
    });
  });

  describe("toGregorian", () => {
    it("should convert 1 Thout 1743 AM to Gregorian 2026-09-11", () => {
      const res = service.toGregorian(1743, 1, 1);
      assert.strictEqual(res.gregorian.iso, "2026-09-11");
      assert.strictEqual(res.gregorian.year, 2026);
      assert.strictEqual(res.gregorian.month, 9);
      assert.strictEqual(res.gregorian.day, 11);
    });

    it("should convert 29 Koiak 1743 AM to Gregorian 2027-01-07", () => {
      const res = service.toGregorian(1743, 4, 29);
      assert.strictEqual(res.gregorian.iso, "2027-01-07");
      assert.strictEqual(res.gregorian.year, 2027);
      assert.strictEqual(res.gregorian.month, 1);
      assert.strictEqual(res.gregorian.day, 7);
    });

    it("should convert 6 Nasie 1743 AM to Gregorian 2027-09-11 in leap year", () => {
      const res = service.toGregorian(1743, 13, 6);
      assert.strictEqual(res.gregorian.iso, "2027-09-11");
      assert.strictEqual(res.coptic.dayOfYear, 366);
    });

    it("should throw BadRequestException for 6 Nasie in a common year", () => {
      assert.throws(
        () => service.toGregorian(1744, 13, 6),
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          assert.ok(err.message.includes("تاريخ قبطي غير صالح"));
          return true;
        }
      );
    });

    it("should throw BadRequestException for day 31 in standard 30-day month", () => {
      assert.throws(
        () => service.toGregorian(1743, 1, 31),
        (err: any) => {
          assert.ok(err instanceof BadRequestException);
          return true;
        }
      );
    });
  });
});
