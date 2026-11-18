import { describe, it } from "node:test";
import assert from "node:assert";
import {
  normalizeArabicText,
  isValidUuid,
  isValidEmail,
  normalizeEmail,
  validatePasswordStrength,
  sanitizeString,
} from "./index";

describe("Validation & Normalization Suite", () => {
  it("should normalize Arabic text with Tashkeel and variant Alefs", () => {
    const raw = "  أَرْثُوذُكْسِيَّةٌ  ";
    const normalized = normalizeArabicText(raw);
    assert.strictEqual(normalized, "ارثوذكسيه");
  });

  it("should strip Tashkeel correctly from biblical names", () => {
    const raw = "يَسُوعُ الْمَسِيحُ";
    const normalized = normalizeArabicText(raw);
    assert.strictEqual(normalized, "يسوع المسيح");
  });

  it("should validate standard UUID v4", () => {
    assert.strictEqual(isValidUuid("c8a42c38-8929-4d64-9b7e-0123456789ab"), true);
    assert.strictEqual(isValidUuid("invalid-uuid"), false);
  });

  it("should validate standard emails", () => {
    assert.strictEqual(isValidEmail("servant@ana-orthodox.dev"), true);
    assert.strictEqual(isValidEmail("invalid-email"), false);
  });

  it("should normalize email addresses", () => {
    assert.strictEqual(normalizeEmail("  Servant@Ana-Orthodox.DEV  "), "servant@ana-orthodox.dev");
    assert.strictEqual(normalizeEmail(""), "");
  });

  it("should validate passwords strictly according to NIST SP 800-63B", () => {
    // Valid 15+ char passphrases (even without arbitrary special chars)
    const validPassphrase = validatePasswordStrength("correct horse battery staple");
    assert.strictEqual(validPassphrase.valid, true);

    const validArabicPassphrase = validatePasswordStrength("في البدء كان الكلمة الأزلية");
    assert.strictEqual(validArabicPassphrase.valid, true);

    // Rejects under 15 characters
    const tooShort = validatePasswordStrength("Short1!Pass");
    assert.strictEqual(tooShort.valid, false);
    assert.ok(tooShort.reasons.some((r) => r.includes("15")));

    // Rejects blocklisted common passwords
    const blocklisted = validatePasswordStrength("copticorthodox2026");
    assert.strictEqual(blocklisted.valid, false);
    assert.ok(blocklisted.reasons.some((r) => r.includes("شائعة جداً")));

    const serviceBlocklisted = validatePasswordStrength("ana-orthodox-2026");
    assert.strictEqual(serviceBlocklisted.valid, false);

    // Rejects repetitive characters
    const repetitive = validatePasswordStrength("aaaaaaaaaaaaaaaa");
    assert.strictEqual(repetitive.valid, false);
    assert.ok(repetitive.reasons.some((r) => r.includes("مكررة")));

    // Rejects passwords exceeding 128 characters
    const tooLong = validatePasswordStrength("a".repeat(129));
    assert.strictEqual(tooLong.valid, false);
    assert.ok(tooLong.reasons.some((r) => r.includes("128")));
  });

  it("should accurately count Unicode code points rather than UTF-16 code units", () => {
    // 14 distinct emoji take 28 code units in UTF-16, but only 14 code points
    // Per NIST SP 800-63B, it must require 15 true code points and thus reject 14 emoji
    const fourteenEmoji = "😀😁😂😃😄😅😆😇😈😉😊😋😌😍"; // 14 distinct non-repetitive code points (28 UTF-16 units)
    assert.strictEqual(fourteenEmoji.length, 28);
    assert.strictEqual(Array.from(fourteenEmoji).length, 14);

    const check14 = validatePasswordStrength(fourteenEmoji);
    // Must fail because true code point count is 14 (< 15)
    assert.strictEqual(check14.valid, false);
    assert.ok(check14.reasons.some((r) => r.includes("15")));

    // 15 distinct emoji take 30 code units and 15 code points -> valid
    const fifteenEmoji = "😀😁😂😃😄😅😆😇😈😉😊😋😌😍😎";
    assert.strictEqual(Array.from(fifteenEmoji).length, 15);
    const check15 = validatePasswordStrength(fifteenEmoji);
    assert.strictEqual(check15.valid, true);

    // Valid 16-character Arabic prayer passphrase with combining marks
    const prayerPassphrase = "يَا رَبِّي يَسُوعُ الْمَسِيحُ ارْحَمْنِي";
    const prayerCheck = validatePasswordStrength(prayerPassphrase);
    assert.strictEqual(prayerCheck.valid, true);

    // Repetitive multi-byte symbols rejected
    const repetitiveSymbols = "☦".repeat(16);
    const repSymbolCheck = validatePasswordStrength(repetitiveSymbols);
    assert.strictEqual(repSymbolCheck.valid, false);
    assert.ok(repSymbolCheck.reasons.some((r) => r.includes("مكررة")));
  });

  it("should sanitize potential XSS characters", () => {
    const dirty = '<script>alert("xss")</script>';
    const clean = sanitizeString(dirty);
    assert.strictEqual(clean, "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
  });
});
