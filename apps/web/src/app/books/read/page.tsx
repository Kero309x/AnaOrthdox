import type { Metadata } from "next";
import { Suspense } from "react";
import BookReader from "@/features/library/components/BookReader";

export const metadata: Metadata = { title: "القراءة — أنا أرثوذكسي" };

export default function Page() {
  return (
    <Suspense>
      <BookReader />
    </Suspense>
  );
}
