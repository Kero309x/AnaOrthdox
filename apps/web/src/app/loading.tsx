export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#145A48] border-t-transparent"></div>
      <p className="text-sm font-medium text-[#4C635A]">جاري تحميل المحتوى القبطي...</p>
    </div>
  );
}
