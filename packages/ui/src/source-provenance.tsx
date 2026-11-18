"use client";

import React, { useState } from "react";
import { AppDialog } from "./dialog";
import { AppButton } from "./button";

export interface SourceProvenanceProps {
  sourceId: string;
  institution: string;
  title: string;
  edition: string;
  referenceLocation: string;
  sourceCategory: string;
  copyrightOwner: string;
  approvalStatus: string;
  lastReviewDate: string;
  officialUrl?: string;
  className?: string;
}

/**
 * Material 3 User-Facing Source Transparency Component
 * Displays a concise trust badge that opens an accessible modal with full provenance details.
 */
export const SourceProvenanceBadge: React.FC<SourceProvenanceProps> = ({
  sourceId,
  institution,
  title,
  edition,
  referenceLocation,
  sourceCategory,
  copyrightOwner,
  approvalStatus,
  lastReviewDate,
  officialUrl,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-full bg-[#D7F0E5] px-3 py-1 text-xs font-semibold text-[#002018] hover:bg-[#C0E7D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145A48] dark:bg-[#00513F] dark:text-[#94F5DA] ${className}`}
        aria-label={`عرض توثيق المصدر الكنسي: ${institution}`}
      >
        <span>🏛️</span>
        <span>توثيق المصدر: {institution}</span>
        <span className="text-[10px]">ℹ️</span>
      </button>

      <AppDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="موثوقية وتوثيق المصدر الكنسي"
        icon="☦"
        actions={
          <div className="flex w-full justify-between items-center">
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#145A48] hover:underline dark:text-[#77D8BE]"
              >
                زيارة المصدر الرسمي ↗
              </a>
            )}
            <AppButton variant="tonal" size="small" onClick={() => setIsOpen(false)}>
              إغلاق
            </AppButton>
          </div>
        }
      >
        <div className="space-y-3 text-right">
          <div className="rounded-xl bg-[#EFF2EE] p-3 dark:bg-[#272B29]">
            <span className="text-xs font-bold text-[#6F7975] dark:text-[#89938E] block">
              الجهة المصدرة / المؤسسة الكنسية
            </span>
            <span className="text-sm font-bold text-[#145A48] dark:text-[#77D8BE]">
              {institution}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-[#DBE5DF] p-2.5 dark:border-[#3F4945]">
              <span className="font-semibold text-[#6F7975] dark:text-[#89938E] block">
                عنوان المرجع / الوثيقة
              </span>
              <span className="font-medium text-[#191C1B] dark:text-[#E1E3DF]">{title}</span>
            </div>

            <div className="rounded-xl border border-[#DBE5DF] p-2.5 dark:border-[#3F4945]">
              <span className="font-semibold text-[#6F7975] dark:text-[#89938E] block">
                الطبعة / الإصدار
              </span>
              <span className="font-medium text-[#191C1B] dark:text-[#E1E3DF]">{edition}</span>
            </div>

            <div className="rounded-xl border border-[#DBE5DF] p-2.5 dark:border-[#3F4945]">
              <span className="font-semibold text-[#6F7975] dark:text-[#89938E] block">
                الموضع الدقيق
              </span>
              <span className="font-medium text-[#191C1B] dark:text-[#E1E3DF]">
                {referenceLocation}
              </span>
            </div>

            <div className="rounded-xl border border-[#DBE5DF] p-2.5 dark:border-[#3F4945]">
              <span className="font-semibold text-[#6F7975] dark:text-[#89938E] block">
                حالة الاعتماد الكنسي
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {approvalStatus}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#6F7975] dark:text-[#89938E] space-y-1 pt-1 border-t border-[#DBE5DF] dark:border-[#3F4945]">
            <p>
              • <strong>معرّف المرجع الثابت:</strong> {sourceId} ({sourceCategory})
            </p>
            <p>
              • <strong>حقوق الطبع والنشر:</strong> {copyrightOwner}
            </p>
            <p>
              • <strong>تاريخ آخر مراجعة كنسية:</strong> {lastReviewDate}
            </p>
          </div>
        </div>
      </AppDialog>
    </>
  );
};
