import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmail } from "@/features/account/components/AuthExtras";

export const metadata: Metadata = { title: "تأكيد البريد — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
