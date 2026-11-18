import React from "react";
import { AppButton } from "./button";

export interface RetryActionProps {
  onRetry: () => void;
  label?: string;
  isLoading?: boolean;
}

export const RetryAction: React.FC<RetryActionProps> = ({
  onRetry,
  label = "إعادة المحاولة",
  isLoading = false,
}) => {
  return (
    <AppButton
      variant="filled"
      size="small"
      onClick={onRetry}
      isLoading={isLoading}
      leadingIcon={<span>🔄</span>}
    >
      {label}
    </AppButton>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState Presentation Pattern
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "لا توجد عناصر حالياً",
  description = "لم يتم إضافة أي بيانات في هذا القسم بعد.",
  icon = "📭",
  action,
  className = "",
}) => {
  return (
    <div
      role="region"
      aria-label={title}
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[#BFC9C3] dark:border-[#3F4945] bg-[#F5F7F3] dark:bg-[#1D201E] ${className}`}
    >
      <span className="text-4xl mb-3" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-base font-bold text-[#191C1B] dark:text-[#E1E3DF]">{title}</h3>
      <p className="mt-1 text-sm text-[#3F4945] dark:text-[#BFC9C3] max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * ErrorState Presentation Pattern
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "تعذّر تحميل البيانات",
  message,
  code,
  onRetry,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#FFDAD6]/40 border border-[#BA1A1A]/30 dark:bg-[#93000A]/20 dark:border-[#FFB4AB]/30 ${className}`}
    >
      <span className="text-4xl mb-3 text-[#BA1A1A] dark:text-[#FFB4AB]" aria-hidden="true">
        ⚠️
      </span>
      <h3 className="text-base font-bold text-[#BA1A1A] dark:text-[#FFB4AB]">{title}</h3>
      <p className="mt-1 text-sm text-[#410002] dark:text-[#FFDAD6] max-w-md">{message}</p>
      {code && (
        <span className="mt-1 text-xs font-mono text-[#690005] dark:text-[#FFB4AB]/80">
          رمز الخطأ: {code}
        </span>
      )}
      {onRetry && (
        <div className="mt-4">
          <RetryAction onRetry={onRetry} />
        </div>
      )}
    </div>
  );
};

export interface OfflineStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * OfflineState Presentation Pattern
 */
export const OfflineState: React.FC<OfflineStateProps> = ({
  message = "أنت غير متصل بالإنترنت حالياً. يتم عرض البيانات المحفوظة محلياً فقط.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#EFF2EE] border border-[#BFC9C3] dark:bg-[#272B29] dark:border-[#3F4945] ${className}`}
    >
      <span className="text-4xl mb-3" aria-hidden="true">
        📡
      </span>
      <h3 className="text-base font-bold text-[#191C1B] dark:text-[#E1E3DF]">
        وضع عدم الاتصال (Offline)
      </h3>
      <p className="mt-1 text-sm text-[#3F4945] dark:text-[#BFC9C3] max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <RetryAction onRetry={onRetry} label="تحقق من الاتصال" />
        </div>
      )}
    </div>
  );
};

export interface NoResultsStateProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

/**
 * NoResultsState Presentation Pattern
 */
export const NoResultsState: React.FC<NoResultsStateProps> = ({
  query,
  onClear,
  className = "",
}) => {
  return (
    <div
      role="region"
      aria-label="لا توجد نتائج بحث"
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[#BFC9C3] dark:border-[#3F4945] bg-[#F5F7F3] dark:bg-[#1D201E] ${className}`}
    >
      <span className="text-4xl mb-3" aria-hidden="true">
        🔍
      </span>
      <h3 className="text-base font-bold text-[#191C1B] dark:text-[#E1E3DF]">
        لم يتم العثور على نتائج
      </h3>
      <p className="mt-1 text-sm text-[#3F4945] dark:text-[#BFC9C3] max-w-sm">
        {query
          ? `لم نجد أي تطابق مع بحثك: "${query}". يرجى التحقق من الكلمات أو استخدام مرادفات أخرى.`
          : "لم يتم العثور على أي نتائج مطابقة لمعايير التصفية الحالية."}
      </p>
      {onClear && (
        <div className="mt-4">
          <AppButton variant="tonal" size="small" onClick={onClear}>
            مسح معايير البحث
          </AppButton>
        </div>
      )}
    </div>
  );
};

/**
 * InlineLoading Presentation Pattern
 */
export const InlineLoading: React.FC<{ label?: string; className?: string }> = ({
  label = "جارٍ التحميل...",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-4 text-sm font-medium text-[#145A48] dark:text-[#77D8BE] ${className}`}
      aria-busy="true"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{label}</span>
    </div>
  );
};

/**
 * PageLoading Presentation Pattern
 */
export const PageLoading: React.FC<{ label?: string }> = ({ label = "جارٍ تجهيز المحتوى..." }) => {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8 text-center"
      aria-busy="true"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-3 border-[#145A48] border-t-transparent dark:border-[#77D8BE] dark:border-t-transparent" />
      <span className="text-sm font-semibold text-[#3F4945] dark:text-[#BFC9C3]">{label}</span>
    </div>
  );
};

/**
 * ContentPlaceholder Presentation Pattern
 */
export const ContentPlaceholder: React.FC<{
  title: string;
  description: string;
  badge?: string;
}> = ({ title, description, badge = "قيد الإعداد الكنسي" }) => {
  return (
    <div className="rounded-2xl border border-[#DBE5DF] bg-white p-6 dark:border-[#3F4945] dark:bg-[#1D201E]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-[#145A48] dark:text-[#77D8BE]">{title}</h4>
        <span className="rounded-full bg-[#D7F0E5] px-2.5 py-0.5 text-xs font-bold text-[#002018] dark:bg-[#00513F] dark:text-[#94F5DA]">
          {badge}
        </span>
      </div>
      <p className="text-sm text-[#3F4945] dark:text-[#BFC9C3] leading-relaxed">{description}</p>
    </div>
  );
};
