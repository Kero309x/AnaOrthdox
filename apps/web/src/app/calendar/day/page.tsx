import type { Metadata } from "next";
import { Suspense } from "react";
import CalendarDay from "@/features/calendar/components/CalendarDay";

export const metadata: Metadata = {
  title: "تفاصيل اليوم — أنا أرثوذكسي",
};

export default function Page() {
  return (
    <Suspense>
      <CalendarDay />
    </Suspense>
  );
}
