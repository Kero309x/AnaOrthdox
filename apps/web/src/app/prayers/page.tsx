import type { Metadata } from "next";
import Prayers from "@/features/prayers/components/Prayers";

export const metadata: Metadata = {
  title: "الصلوات — أنا أرثوذكسي",
};

export default function Page() {
  return <Prayers />;
}
