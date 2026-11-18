"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "standard" | "filled" | "tonal" | "outlined";
  size?: "small" | "medium" | "large";
  href?: string;
  target?: string;
  selected?: boolean;
  children: React.ReactNode;
}

/**
 * Official Material 3 Icon Button Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-icon-button
 * - md-filled-icon-button
 * - md-filled-tonal-icon-button
 * - md-outlined-icon-button
 */
export const AppIconButton: React.FC<AppIconButtonProps> = ({
  variant = "standard",
  size = "medium",
  disabled = false,
  className = "",
  children,
  onClick,
  href,
  target,
  selected,
  ...props
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const sizeClasses = {
    small: "h-9 w-9 text-base",
    medium: "h-11 w-11 text-lg", // 44-48px touch target
    large: "h-14 w-14 text-2xl",
  };

  const sharedProps = {
    disabled,
    href,
    target,
    selected,
    className: `inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`,
    onClick: disabled ? undefined : onClick,
    ...props,
  };

  switch (variant) {
    case "filled":
      return <md-filled-icon-button {...sharedProps}>{children}</md-filled-icon-button>;
    case "tonal":
      return <md-filled-tonal-icon-button {...sharedProps}>{children}</md-filled-tonal-icon-button>;
    case "outlined":
      return <md-outlined-icon-button {...sharedProps}>{children}</md-outlined-icon-button>;
    case "standard":
    default:
      return <md-icon-button {...sharedProps}>{children}</md-icon-button>;
  }
};

export const IconButton = AppIconButton;
