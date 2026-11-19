import type { Metadata } from "next";
import ReadingDetail from "@/features/readings/components/ReadingDetail";

export const metadata: Metadata = {
  title: "قراءة اليوم — أنا أرثوذكسي",
};

import { notFound } from "next/navigation";
import { slotById } from "@/domain/readings/slots";

export default async function Page({ params }: { params: Promise<{slot: string}> }) {
  const {slot} = await params;
  if (!slotById(slot)) notFound();
  return <ReadingDetail />;
}
