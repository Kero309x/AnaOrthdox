import type { Metadata } from "next";
import { Suspense } from "react";
import AudioPlayer from "@/features/media/components/AudioPlayer";

export const metadata: Metadata = {
  title: "المشغّل — أنا أرثوذكسي",
};

export default function Page() {
  return (
    <Suspense>
      <AudioPlayer />
    </Suspense>
  );
}
