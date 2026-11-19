import type { Metadata } from "next";
import CopticCalendar from "@/features/calendar/components/CopticCalendar";

export const metadata: Metadata = {
  title: "التقويم القبطي — أنا أرثوذكسي",
};

export default function Page() {
  return <CopticCalendar />;
}
