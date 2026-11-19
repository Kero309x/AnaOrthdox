import type { Metadata } from "next";
import Games from "@/features/games/components/Games";

export const metadata: Metadata = {
  title: "ألعاب ومسابقات — أنا أرثوذكسي",
};

export default function Page() {
  return <Games />;
}
