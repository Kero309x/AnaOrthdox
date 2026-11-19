import type { Metadata } from "next";
import Books from "@/features/library/components/Books";

export const metadata: Metadata = {
  title: "مكتبة الكتب — أنا أرثوذكسي",
};

export default function Page() {
  return <Books />;
}
