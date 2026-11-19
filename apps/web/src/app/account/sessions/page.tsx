import type { Metadata } from "next";
import { Suspense } from "react";
import { Sessions } from "@/features/account/components/AuthExtras";

export const metadata: Metadata = { title: "الأجهزة المتصلة — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <Sessions />
    </Suspense>
  );
}
