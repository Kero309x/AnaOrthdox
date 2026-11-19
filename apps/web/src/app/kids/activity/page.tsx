import type { Metadata } from "next";
import { Suspense } from "react";
import KidsActivityView from "@/features/kids/components/KidsActivityView";

export const metadata: Metadata = { title: "نشاط — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <KidsActivityView />
    </Suspense>
  );
}
