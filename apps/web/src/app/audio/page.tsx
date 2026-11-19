import type { Metadata } from "next";
import Audio from "@/features/media/components/Audio";

export const metadata: Metadata = {
  title: "ترانيم وألحان — أنا أرثوذكسي",
};

export default function Page() {
  return <Audio />;
}
