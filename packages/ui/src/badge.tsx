import React from "react";

export interface AppBadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "neutral" | "error";
  className?: string;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = "primary",
  className = "",
}) => {
  const styles = {
    primary: "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]",
    secondary: "bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]",
    neutral: "bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)]",
    error: "bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
