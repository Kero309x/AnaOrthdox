"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppProgressIndicatorProps {
  variant?: "circular" | "linear" | "wavy";
  type?: "circular" | "linear";
  size?: "small" | "medium" | "large" | string;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  fourColor?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official Material 3 Progress Indicator Component
 * Supports standard and expressive wavy variants from @materialwebunofficial/md3e-web:
 * - md-progress-indicator (variant="wavy")
 * - md-circular-progress
 * - md-linear-progress
 */
export const AppProgressIndicator: React.FC<AppProgressIndicatorProps> = ({
  variant,
  type = "circular",
  value,
  max = 1,
  indeterminate = true,
  fourColor = false,
  className = "",
  style,
}) => {
  const effectiveVariant = variant ?? type ?? "circular";
  useEffect(() => {
    initMaterialWeb();
  }, []);

  if (effectiveVariant === "wavy") {
    return (
      <md-progress-indicator
        type={type}
        variant="wavy"
        value={value}
        max={max}
        indeterminate={indeterminate}
        className={className}
        style={style}
      />
    );
  }

  if (effectiveVariant === "linear") {
    return (
      <md-linear-progress
        value={value}
        max={max}
        indeterminate={indeterminate}
        four-color={fourColor}
        className={`w-full ${className}`}
        style={style}
      />
    );
  }

  return (
    <md-circular-progress
      value={value}
      max={max}
      indeterminate={indeterminate}
      four-color={fourColor}
      className={className}
      style={style}
    />
  );
};

export const Progress = AppProgressIndicator;
