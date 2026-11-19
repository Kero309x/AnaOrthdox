import type { Metadata } from "next";
import ChurchDetail from "@/features/churches/components/ChurchDetail";

export const metadata: Metadata = {
  title: "تفاصيل الكنيسة — أنا أرثوذكسي",
};

export default function Page() {
  return <ChurchDetail />;
}
