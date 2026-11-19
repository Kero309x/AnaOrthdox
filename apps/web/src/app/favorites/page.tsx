import type { Metadata } from "next";
import Favorites from "@/features/account/components/Favorites";

export const metadata: Metadata = { title: "مفضلتي — أنا أرثوذكسي" };

export default function Page() {
  return <Favorites />;
}
