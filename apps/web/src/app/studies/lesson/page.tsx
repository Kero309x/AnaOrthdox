import type { Metadata } from "next";
import { Suspense } from "react";
import StudyLessonView from "@/features/library/components/StudyLessonView";

export const metadata: Metadata = { title: "الدرس — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <StudyLessonView />
    </Suspense>
  );
}
