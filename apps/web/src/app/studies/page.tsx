import type { Metadata } from "next";
import Studies from "@/features/library/components/Studies";

export const metadata: Metadata = {
  title: "دراسات الكتاب المقدس — أنا أرثوذكسي",
};

export default function Page() {
  return <Studies />;
}
