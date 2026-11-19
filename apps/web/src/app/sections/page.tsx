import type { Metadata } from "next";
import Sections from "@/shared/ui/Sections";

export const metadata: Metadata = {
  title: "كل الأقسام — أنا أرثوذكسي",
};

export default function Page() {
  return <Sections />;
}
