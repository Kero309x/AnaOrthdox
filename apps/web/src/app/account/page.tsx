import type { Metadata } from "next";
import Account from "@/features/account/components/Account";

export const metadata: Metadata = {
  title: "حسابي — أنا أرثوذكسي",
};

export default function Page() {
  return <Account />;
}
