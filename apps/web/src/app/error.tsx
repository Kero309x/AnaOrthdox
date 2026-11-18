"use client";

import { useEffect } from "react";
import { AppButton } from "@ana-orthodox/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-2xl border border-[#BA1A1A]/20 bg-[#FFDAD6]/30 p-8 max-w-md">
        <h2 className="text-xl font-bold text-[#BA1A1A]">حدث خطأ أثناء تحميل الصفحة</h2>
        <p className="mt-2 text-sm text-[#410002]">
          نعتذر عن هذا الخطأ المؤقت. يمكنك محاولة إعادة التحميل.
        </p>
        <div className="mt-6">
          <AppButton onClick={() => reset()} variant="filled">
            إعادة المحاولة
          </AppButton>
        </div>
      </div>
    </div>
  );
}
