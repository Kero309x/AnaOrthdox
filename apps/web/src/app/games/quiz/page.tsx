import type { Metadata } from "next";
import Quiz from "@/features/games/components/Quiz";

export const metadata: Metadata = {
  title: "سلّم الأسئلة — أنا أرثوذكسي",
};

export default function Page() {
  return <Quiz />;
}
