import type { Metadata } from "next";
import Compass from "@/features/compass/components/Compass";

export const metadata: Metadata = {
  title: "البوصلة — أنا أرثوذكسي",
};

export default function Page() {
  return <Compass />;
}
