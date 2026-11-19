export interface AgpeyaLine { text: string; response?: boolean }

export type AgpeyaBlock =
  | { type: "prose"; id: string; kind: string; title: string; lines: AgpeyaLine[]; rubric?: string; repeat?: number }
  | { type: "verses"; id: string; kind: string; title: string; reference?: string; verses: { num: number; text: string }[]; rubric?: string };

export type AgpeyaItem =
  | AgpeyaBlock
  | { type: "watch"; id: string; title: string; theme?: string; blocks: AgpeyaBlock[] };

export interface AgpeyaHour {
  id: string;
  name: string;
  traditionalTime?: string;
  items: AgpeyaItem[];
}
