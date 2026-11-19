import type { Metadata } from "next";
import Search from "@/features/account/components/Search";

export const metadata: Metadata = { title: "بحث — أنا أرثوذكسي" };

export default function Page() {
  return <Search />;
}
