/**
 * Ana Orthodox — Shared Validation and Normalization Utilities
 */

/**
 * Validates whether a string is a standard UUID v4
 */
export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validates whether an email format is structurally sound
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Normalizes an email address by trimming whitespace and converting to lowercase
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Normalizes a password string using Unicode Normalization Form C (NFC)
 * to ensure consistent canonical representation across operating systems and keyboards.
 */
export function normalizePassword(password: string): string {
  if (!password || typeof password !== "string") return "";
  return password.normalize("NFC");
}

export interface PasswordValidationResult {
  valid: boolean;
  reasons: string[];
}

/**
 * Common / Compromised password blocklist per NIST SP 800-63B Section 5.1.1.2.
 * Includes common weak passwords, dictionary sequences, and predictable domain phrases.
 */
const COMMON_PASSWORD_BLOCKLIST = new Set([
  "password1234567",
  "password12345678",
  "passwordpassword",
  "123456789012345",
  "1234567890123456",
  "12345678901234567890",
  "qwertyuiopasdfg",
  "qwertyuiopasdfgh",
  "copticorthodox2026",
  "copticchurch2026",
  "anaorthodox12345",
  "anaorthodox2026",
  "ana-orthodox-2026",
  "orthodoxchristian2026",
  "orthodoxchurch2026",
  "stmarkcopticorthodox",
  "churchofalexandria",
  "mar-girgis-alexandria",
  "ilovejesus12345",
  "christianity2026",
  "letmeinplease1234",
  "letmeinplease12345",
  "administrator1234",
  "correcthorsebatterystaple",
]);

/**
 * Validates password strength according to NIST SP 800-63B-4 and OWASP standards:
 * - Minimum 15 Unicode code points for single-factor (password-only) authentication.
 * - Maximum 128 Unicode code points without silent truncation.
 * - Evaluates Unicode code points (via Array.from) rather than UTF-16 code units.
 * - Allows arbitrary passphrases (spaces, Unicode, Arabic, punctuation) without forced composition rules.
 * - Unicode NFC normalized.
 * - Checked against a blocklist of compromised and commonly used passwords.
 * - Detects trivial repetitive single-character sequences (e.g. 15 identical characters).
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const reasons: string[] = [];

  if (!password || typeof password !== "string") {
    return { valid: false, reasons: ["كلمة المرور مطلوبة (Password is required)"] };
  }

  const normalized = normalizePassword(password);
  const codePoints = Array.from(normalized);
  const codePointLength = codePoints.length;

  if (codePointLength < 15) {
    reasons.push(
      "يجب ألا تقل كلمة المرور أو العبارة السرية عن 15 حرفاً (Minimum 15 characters required per NIST SP 800-63B)"
    );
  }

  if (codePointLength > 128) {
    reasons.push("يجب ألا تزيد كلمة المرور عن 128 حرفاً (Maximum 128 characters allowed)");
  }

  const lower = normalized.toLowerCase();

  // Check against common/compromised blocklist
  if (COMMON_PASSWORD_BLOCKLIST.has(lower)) {
    reasons.push(
      "كلمة المرور شائعة جداً وسهلة التخمين، يرجى اختيار عبارة سرية فريدة (Password is too common or easily guessed)"
    );
  }

  // Detect repetitive single-character patterns (e.g. 15 identical code points)
  if (codePointLength >= 15 && new Set(codePoints).size === 1) {
    reasons.push(
      "كلمة المرور تحتوي على أحرف مكررة يسهل تخمينها (Password consists of repeated characters)"
    );
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

/**
 * Normalizes Arabic text by removing diacritics (Tashkeel) and standardizing Alef variants
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return (
    text
      // Remove Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Tanween, Shadda)
      .replace(/[\u064B-\u0652\u0670]/g, "")
      // Normalize Alef variants (أ, إ, آ -> ا)
      .replace(/[أإآ]/g, "ا")
      // Normalize Taa Marbuta (ة -> ه)
      .replace(/ة/g, "ه")
      // Normalize Yaa (ى -> ي)
      .replace(/ى/g, "ي")
      .trim()
  );
}

/**
 * Sanitizes user input string against HTML injection
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
