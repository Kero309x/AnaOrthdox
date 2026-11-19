import type { Metadata } from "next";
import Words from "@/features/games/components/Words";

export const metadata: Metadata = { title: "ألغاز الكلمات — أنا أرثوذكسي" };

export default function Page() {
  return <Words />;
}
