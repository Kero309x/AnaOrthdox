import type { Metadata } from "next";
import Sources from "@/features/settings/components/Sources";

export const metadata: Metadata = {
  title: "المصادر — أنا أرثوذكسي",
};

export default function Page() {
  return <Sources />;
}
