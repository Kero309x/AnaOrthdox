import type { Metadata } from "next";
import QuickQuiz from "@/features/games/components/QuickQuiz";

export const metadata: Metadata = { title: "أسئلة سريعة — أنا أرثوذكسي" };

export default function Page() {
  return <QuickQuiz mode="quick" />;
}
