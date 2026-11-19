import type { Metadata } from "next";
import Kids from "@/features/kids/components/Kids";

export const metadata: Metadata = {
  title: "ركن الأطفال — أنا أرثوذكسي",
};

export default function Page() {
  return <Kids />;
}
