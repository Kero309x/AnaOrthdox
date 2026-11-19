import type { Metadata } from "next";
import Crossword from "@/features/games/components/Crossword";

export const metadata: Metadata = { title: "كلمات متقاطعة — أنا أرثوذكسي" };

export default function Page() {
  return <Crossword />;
}
