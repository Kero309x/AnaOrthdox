import type { Metadata } from "next";
import Contributors from "@/features/contributors/components/Contributors";

export const metadata: Metadata = {
  title: "المساهمون — أنا أرثوذكسي",
};

// ?lang=en renders the fully English version for preview; Arabic is the
// default. The language-switch UI itself is a separate product decision.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <Contributors lang={lang === "en" ? "en" : "ar"} />;
}
