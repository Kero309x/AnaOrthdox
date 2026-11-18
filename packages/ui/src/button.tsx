"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "outlined" | "text" | "elevated";
  size?: "small" | "medium" | "large";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  isLoading?: boolean;
  href?: string;
  target?: string;
  children: React.ReactNode;
}

/**
 * Official Material 3 Button Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-filled-button
 * - md-outlined-button
 * - md-text-button
 * - md-elevated-button
 * - md-tonal-button
 */
export const AppButton: React.FC<AppButtonProps> = ({
  variant = "filled",
  size = "medium",
  leadingIcon,
  trailingIcon,
  isLoading = false,
  disabled,
  className = "",
  href,
  target,
  children,
  onClick,
  type = "button",
  ...props
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const isDisabled = disabled || isLoading;

  const sizeStyles = {
    small: "min-h-[36px] text-xs font-semibold px-3",
    medium: "min-h-[48px] text-sm font-semibold px-5", // M3 standard 48px touch target
    large: "min-h-[56px] text-base font-semibold px-6",
  };

  const sharedProps = {
    disabled: isDisabled,
    href: href,
    target: target,
    type: type,
    className: `select-none transition-transform active:scale-[0.98] ${sizeStyles[size]} ${className}`,
    onClick: isDisabled ? undefined : onClick,
    ...props,
  };

  const content = (
    <>
      {isLoading ? (
        <span slot="icon" className="inline-flex items-center justify-center animate-spin me-2 text-current">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </span>
      ) : (
        leadingIcon && <span slot="icon" className="me-2 inline-flex items-center">{leadingIcon}</span>
      )}
      {children}
      {trailingIcon && <span slot="trailing-icon" className="ms-2 inline-flex items-center">{trailingIcon}</span>}
    </>
  );

  switch (variant) {
    case "outlined":
      return <md-outlined-button {...sharedProps}>{content}</md-outlined-button>;
    case "text":
      return <md-text-button {...sharedProps}>{content}</md-text-button>;
    case "elevated":
      return <md-elevated-button {...sharedProps}>{content}</md-elevated-button>;
    case "tonal":
      return <md-filled-tonal-button {...sharedProps}>{content}</md-filled-tonal-button>;
    case "filled":
    default:
      return <md-filled-button {...sharedProps}>{content}</md-filled-button>;
  }
};

/** Explicit M3 Variant Components */
export const FilledButton: React.FC<Omit<AppButtonProps, "variant">> = (props) => (
  <AppButton variant="filled" {...props} />
);

export const OutlinedButton: React.FC<Omit<AppButtonProps, "variant">> = (props) => (
  <AppButton variant="outlined" {...props} />
);

export const TextButton: React.FC<Omit<AppButtonProps, "variant">> = (props) => (
  <AppButton variant="text" {...props} />
);

export const TonalButton: React.FC<Omit<AppButtonProps, "variant">> = (props) => (
  <AppButton variant="tonal" {...props} />
);

export const ElevatedButton: React.FC<Omit<AppButtonProps, "variant">> = (props) => (
  <AppButton variant="elevated" {...props} />
);
