import type { Metadata } from "next";
import Login from "@/features/account/components/Login";

export const metadata: Metadata = { title: "تسجيل الدخول — أنا أرثوذكسي" };

export default function Page() {
  return <Login mode="in" />;
}
