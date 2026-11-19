import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPassword } from "@/features/account/components/AuthExtras";

export const metadata: Metadata = { title: "كلمة مرور جديدة — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
