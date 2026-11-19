/** Maps the app's hour ids (kept stable for the saved "prayed today" ticks) to the upstream Agpeya hour ids. */
export const AGPEYA_HOURS = [
  { id: "baaker", upstream: "prime" },
  { id: "thalitha", upstream: "terce" },
  { id: "sadisa", upstream: "sext" },
  { id: "taseaa", upstream: "none" },
  { id: "ghoroub", upstream: "vespers" },
  { id: "noum", upstream: "compline" },
  { id: "montasaf", upstream: "midnight" },
] as const;

/**
 * Default: the bundled dataset in src/data/agpeya/agpeya.json (built by scripts/agpeya-export.py, see docs/features/AGPEYA.md),
 * which has all seven hours, the Veil prayer and the three midnight watches. NEXT_PUBLIC_AGPEYA_SOURCE=coptic-api switches
 * back to the incomplete coptic.io API (kept only for comparison; never the default).
 */
export const BUNDLED = process.env.NEXT_PUBLIC_AGPEYA_SOURCE !== "coptic-api";
export const VEIL_HOUR = { id: "satar", upstream: "veil" } as const;

export type AgpeyaHourSlug = (typeof AGPEYA_HOURS)[number]["id"];

export function hourBySlug(slug: string) {
  if (BUNDLED && slug === VEIL_HOUR.id) return VEIL_HOUR;
  return AGPEYA_HOURS.find((h) => h.id === slug);
}
