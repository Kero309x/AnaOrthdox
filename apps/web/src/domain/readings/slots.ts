// The daily slots of the Coptic lectionary, in order. Shared between the
// readings list and the reading detail screen. Actual per-day texts depend
// on the liturgical calendar and need a verified data source.
export const READING_SLOTS = [
  { id: "baaker", name: "قراءات باكر", hint: "مزمور وإنجيل صلاة باكر" },
  { id: "paul", name: "البولس", hint: "رسائل بولس الرسول" },
  { id: "catholic", name: "الكاثوليكون", hint: "الرسائل الجامعة" },
  { id: "praxis", name: "الإبركسيس", hint: "أعمال الرسل" },
  { id: "psalm", name: "المزمور", hint: "مزمور القداس" },
  { id: "gospel", name: "الإنجيل", hint: "إنجيل القداس" },
  { id: "synaxar", name: "السنكسار", hint: "سير القديسين وأحداث اليوم" },
] as const;

export type ReadingSlotId = (typeof READING_SLOTS)[number]["id"];

export function slotById(id: string) {
  return READING_SLOTS.find((slot) => slot.id === id);
}
