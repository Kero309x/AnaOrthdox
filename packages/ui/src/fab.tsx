"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppFABProps {
  label?: string;
  icon: React.ReactNode;
  variant?: "surface" | "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  lowered?: boolean;
  extended?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Official Material 3 FAB (Floating Action Button) Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-fab
 */
export const AppFAB: React.FC<AppFABProps> = ({
  label,
  icon,
  variant = "primary",
  size = "medium",
  lowered = false,
  disabled = false,
  onClick,
  className = "",
  ariaLabel,
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <md-fab
      label={label}
      variant={variant}
      size={size}
      lowered={lowered}
      disabled={disabled}
      className={`select-none cursor-pointer ${className}`}
      aria-label={ariaLabel || label}
      onClick={disabled ? undefined : onClick}
    >
      <span slot="icon" className="text-xl inline-flex items-center justify-center">
        {icon}
      </span>
    </md-fab>
  );
};

export const FloatingActionButton = AppFAB;
