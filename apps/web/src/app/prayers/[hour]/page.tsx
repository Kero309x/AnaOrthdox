import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgpeyaReader from "@/features/prayers/components/AgpeyaReader";
import { AGPEYA_HOURS, BUNDLED, VEIL_HOUR, hourBySlug } from "@/domain/agpeya/hours";

export const metadata: Metadata = { title: "الأجبية — أنا أرثوذكسي" };

export function generateStaticParams() {
  return [...AGPEYA_HOURS, ...(BUNDLED ? [VEIL_HOUR] : [])].map((h) => ({ hour: h.id }));
}

export default async function Page({ params }: { params: Promise<{ hour: string }> }) {
  const { hour } = await params;
  if (!hourBySlug(hour)) notFound();
  return <AgpeyaReader slug={hour} />;
}
