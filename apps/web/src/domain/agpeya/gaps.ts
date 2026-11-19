import { AGPEYA_HOURS, BUNDLED } from "./hours";

/**
 * Parts that the open source (coptic.io) does not carry for an hour. Found by comparing its output with the
 * St-Takla.org Agpeya page for the same hour (see docs/features/AGPEYA.md). Descriptions only: no prayer text is
 * generated or filled in here. Revisit when the source or a replacement changes.
 */
const DAY_HOURS = ["prime", "terce", "sext", "none", "vespers", "compline"];
const COMMON = ["الصلاة الربانية بعد مقدمة كل ساعة (مكتوبة في صفحة الأنبا تكلا بعد «مقدمة كل ساعة» مباشرة)"];

export const KNOWN_GAPS: Record<string, string[]> = {
  prime: [...COMMON, "البولس (من رسالة أفسس ٤) وفقرة «من إيمان الكنيسة» في بدء صلاة باكر"],
  terce: COMMON,
  sext: COMMON,
  none: COMMON,
  vespers: COMMON,
  compline: COMMON,
  midnight: [
    "ترنيمة «قوموا يا بني النور» في بدء صلاة نصف الليل",
    "التحليل الكبير لنصف الليل وتحليل الكهنة بعد الصلاة",
    "بعض فقرات الثلاث تقديسات والطلبات في ختام الخدمات",
  ],
};

export const MISSING_EVERYWHERE = BUNDLED ? "" : "صلاة الستار غير موجودة في المصدر.";

export function gapsFor(slug: string): string[] {
  if (BUNDLED) return [];
  const upstream = AGPEYA_HOURS.find((h) => h.id === slug)?.upstream;
  return upstream && DAY_HOURS.concat("midnight").includes(upstream) ? KNOWN_GAPS[upstream] : [];
}
