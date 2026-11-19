import type { Metadata } from "next";
import Videos from "@/features/media/components/Videos";

export const metadata: Metadata = {
  title: "فيديوهات — أنا أرثوذكسي",
};

export default function Page() {
  return <Videos />;
}
