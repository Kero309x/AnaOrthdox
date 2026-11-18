"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
  variant?: "shimmer" | "pulse";
  "aria-label"?: string;
}

/**
 * Material 3 Expressive (M3E) Skeleton Component with Genuine Shimmer
 * Implements traveling light wave shimmer animation (not merely pulse opacity).
 * Fully respects prefers-reduced-motion: reduce with static surface fallback.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
  variant = "shimmer",
  "aria-label": ariaLabel = "جاري تحميل المحتوى...",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const roundedClasses = {
    none: "rounded-none",
    xs: "rounded-sm",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  };

  const animationClass =
    variant === "shimmer"
      ? "m3-skeleton-shimmer"
      : "animate-pulse bg-[#E3E6E2] dark:bg-[#272B29] motion-reduce:animate-none";

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <m3e-skeleton
      role="status"
      aria-label={ariaLabel}
      style={style}
      className={`block select-none ${roundedClasses[rounded]} ${animationClass} ${className}`}
    >
      <span className="sr-only">{ariaLabel}</span>
    </m3e-skeleton>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = "",
}) => (
  <div className={`space-y-2.5 w-full ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        width={i === lines - 1 ? "60%" : "100%"}
        rounded="sm"
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = "",
}) => <Skeleton width={size} height={size} rounded="full" className={className} />;

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`rounded-2xl border border-[#DBE5DF] dark:border-[#3F4945] p-6 space-y-4 bg-[#FFFFFF] dark:bg-[#1D201E] ${className}`}
  >
    <div className="flex items-center gap-3">
      <SkeletonAvatar size={44} />
      <div className="space-y-2 flex-1">
        <Skeleton height={14} width="40%" rounded="sm" />
        <Skeleton height={12} width="25%" rounded="sm" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className = "",
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded-xl border border-[#DBE5DF] dark:border-[#3F4945] bg-[#FFFFFF] dark:bg-[#1D201E]"
      >
        <SkeletonAvatar size={36} />
        <div className="flex-1 space-y-1.5">
          <Skeleton height={14} width="50%" rounded="sm" />
          <Skeleton height={10} width="30%" rounded="sm" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonCalendar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`rounded-3xl border border-[#DBE5DF] dark:border-[#3F4945] p-6 space-y-4 bg-[#FFFFFF] dark:bg-[#1D201E] ${className}`}
  >
    <div className="flex justify-between items-center mb-4">
      <Skeleton height={24} width={120} rounded="sm" />
      <Skeleton height={32} width={80} rounded="full" />
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} height={40} rounded="md" />
      ))}
    </div>
  </div>
);
