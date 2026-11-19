import type { Metadata } from "next";
import Settings from "@/features/settings/components/Settings";

export const metadata: Metadata = {
  title: "الإعدادات — أنا أرثوذكسي",
};

export default function Page() {
  return <Settings />;
}
