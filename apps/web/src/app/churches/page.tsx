import type { Metadata } from "next";
import Churches from "@/features/churches/components/Churches";

export const metadata: Metadata = {
  title: "الكنائس — أنا أرثوذكسي",
};

export default function Page() {
  return <Churches />;
}
