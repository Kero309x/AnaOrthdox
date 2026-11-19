import type { Metadata } from "next";
import { Suspense } from "react";
import VideoWatch from "@/features/media/components/VideoWatch";

export const metadata: Metadata = { title: "مشاهدة — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <VideoWatch />
    </Suspense>
  );
}
