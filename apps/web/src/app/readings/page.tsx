import type { Metadata } from "next";
import Readings from "@/features/readings/components/Readings";

export const metadata: Metadata = {
  title: "قراءة اليوم — أنا أرثوذكسي",
};

export default function Page() {
  return <Readings />;
}
