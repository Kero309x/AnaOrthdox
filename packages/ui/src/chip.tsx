"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  variant?: "assist" | "filter" | "suggestion";
  onClick?: () => void;
  className?: string;
}

/**
 * Official Material 3 Chips Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-assist-chip
 * - md-filter-chip
 * - md-suggestion-chip
 */
export const AppChip: React.FC<AppChipProps> = ({
  label,
  selected = false,
  disabled = false,
  icon,
  leadingIcon,
  variant = "filter",
  onClick,
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const effectiveIcon = icon || leadingIcon;

  const content = (
    <>
      {effectiveIcon && <span slot="icon" className="inline-flex items-center text-sm">{effectiveIcon}</span>}
      <span>{label}</span>
    </>
  );

  const sharedProps = {
    label,
    selected,
    disabled,
    onClick: disabled ? undefined : onClick,
    className: `select-none ${className}`,
  };

  switch (variant) {
    case "assist":
      return <md-assist-chip {...sharedProps}>{content}</md-assist-chip>;
    case "suggestion":
      return <md-suggestion-chip {...sharedProps}>{content}</md-suggestion-chip>;
    case "filter":
    default:
      return <md-filter-chip {...sharedProps}>{content}</md-filter-chip>;
  }
};

export const AppChipSet: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return <md-chip-set className={`flex flex-wrap gap-2 ${className}`}>{children}</md-chip-set>;
};
