import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-6xl font-bold text-[#145A48]">٤٠٤</span>
      <h2 className="text-2xl font-bold text-[#191C1B]">الصفحة المطلوبة غير موجودة</h2>
      <p className="max-w-md text-sm text-[#4C635A]">
        لم نتمكن من العثور على المسار الذي تبحث عنه. يرجى الرجوع إلى الصفحة الرئيسية أو استخدام
        قائمة التنقل.
      </p>
      <div className="mt-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#145A48] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0E3E32] transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
