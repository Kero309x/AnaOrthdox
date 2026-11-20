import type { Metadata } from "next";
import Words from "@/features/media/components/Words";

export const metadata: Metadata = {
  title: "الترانيم المكتوبة — أنا أرثوذكسي",
};

export default function Page() {
  return <Words />;
}
