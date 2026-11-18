import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { BibleService } from "./bible.service";

describe("BibleService Suite", () => {
  let service: BibleService;

  beforeEach(() => {
    service = new BibleService();
  });

  it("should return the canonical list of baseline books", async () => {
    const books = await service.getBooks();
    assert.ok(books);
    assert.ok(books.length >= 7);
    assert.strictEqual(books[0]?.code, "GEN");
  });

  it("should resolve book by canonical code", async () => {
    const matthew = await service.getBookByCode("MAT");
    assert.ok(matthew);
    assert.strictEqual(matthew?.nameArabic, "متى");
    assert.strictEqual(matthew?.testament, "NEW");
  });

  it("should return null for non-existent book code", async () => {
    const missing = await service.getBookByCode("NON_EXISTENT");
    assert.strictEqual(missing, null);
  });
});
