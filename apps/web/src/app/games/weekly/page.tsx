import type { Metadata } from "next";
import QuickQuiz from "@/features/games/components/QuickQuiz";

export const metadata: Metadata = { title: "تحديات أسبوعية — أنا أرثوذكسي" };

export default function Page() {
  return <QuickQuiz mode="weekly" />;
}
