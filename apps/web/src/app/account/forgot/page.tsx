import type { Metadata } from "next";
import Login from "@/features/account/components/Login";

export const metadata: Metadata = { title: "استرجاع كلمة المرور — أنا أرثوذكسي" };

export default function Page() {
  return <Login mode="forgot" />;
}
