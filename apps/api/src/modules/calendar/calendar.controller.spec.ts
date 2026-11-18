import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

describe("CalendarController Unit Suite", () => {
  let controller: CalendarController;
  let service: CalendarService;

  beforeEach(() => {
    service = new CalendarService();
    controller = new CalendarController(service);
  });

  it("fromGregorian should delegate to service and return conversion result", () => {
    const res = controller.fromGregorian({ date: "2026-09-11" });
    assert.strictEqual(res.coptic.year, 1743);
    assert.strictEqual(res.coptic.month, 1);
    assert.strictEqual(res.coptic.day, 1);
    assert.strictEqual(res.coptic.monthCode, "thout");
  });

  it("toGregorian should delegate to service and return conversion result", () => {
    const res = controller.toGregorian({ year: 1743, month: 1, day: 1 });
    assert.strictEqual(res.gregorian.iso, "2026-09-11");
    assert.strictEqual(res.gregorian.year, 2026);
    assert.strictEqual(res.gregorian.month, 9);
    assert.strictEqual(res.gregorian.day, 11);
  });
});
