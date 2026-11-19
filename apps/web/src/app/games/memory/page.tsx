import type { Metadata } from "next";
import Memory from "@/features/games/components/Memory";

export const metadata: Metadata = {
  title: "ذاكرة الصور — أنا أرثوذكسي",
};

export default function Page() {
  return <Memory />;
}
