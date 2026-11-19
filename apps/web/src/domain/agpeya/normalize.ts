import type { AgpeyaBlock, AgpeyaLine, AgpeyaHour, AgpeyaItem } from "./types";

export class AgpeyaShapeError extends Error {}

const isRec = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

function line(l: unknown, id: string): AgpeyaLine {
  if (typeof l === "string") return { text: l };
  if (isRec(l) && typeof l.text === "string") return l.isResponse === true ? { text: l.text, response: true } : { text: l.text };
  throw new AgpeyaShapeError(`bad line in ${id}`);
}

function block(raw: unknown): AgpeyaBlock {
  if (!isRec(raw)) throw new AgpeyaShapeError("section is not an object");
  const id = str(raw.id), kind = str(raw.kind), title = str(raw.title) ?? "";
  if (!id || !kind) throw new AgpeyaShapeError("section without id/kind");
  const rubric = str(raw.rubric);
  if (Array.isArray(raw.verses)) {
    const verses = raw.verses.map((v) => {
      if (!isRec(v) || typeof v.num !== "number" || typeof v.text !== "string") throw new AgpeyaShapeError(`bad verse in ${id}`);
      return { num: v.num, text: v.text };
    });
    return { type: "verses", id, kind, title, reference: str(raw.reference), verses, rubric };
  }
  if (Array.isArray(raw.content) && raw.content.length > 0) {
    return { type: "prose", id, kind, title, lines: raw.content.map((l) => line(l, id)), rubric };
  }
  throw new AgpeyaShapeError(`section ${id} has no text`);
}

/** Validates an upstream hour (include=sections) and keeps it in prayed order. Never invents or fills text. */
export function normalizeHour(raw: unknown, expectedId: string): AgpeyaHour {
  if (!isRec(raw) || raw.id !== expectedId || typeof raw.name !== "string" || !Array.isArray(raw.sections)) {
    throw new AgpeyaShapeError("unexpected hour payload");
  }
  const items: AgpeyaItem[] = raw.sections.map((s) => {
    if (isRec(s) && s.kind === "watch") {
      if (!Array.isArray(s.sections)) throw new AgpeyaShapeError("watch without sections");
      const intro: AgpeyaBlock[] = [];
      const prayer = str(s.prayer);
      if (prayer) intro.push({ type: "prose", id: `${s.id}-prayer`, kind: "hour-intro", title: "", lines: [{ text: prayer }] });
      return { type: "watch", id: String(s.id), title: str(s.title) ?? "", theme: str(s.theme), blocks: [...intro, ...s.sections.map(block)] };
    }
    return block(s);
  });
  if (items.length === 0) throw new AgpeyaShapeError("hour has no sections");
  return { id: raw.id, name: raw.name, traditionalTime: str(raw.traditionalTime), items };
}
