"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppListItemProps {
  headline: string;
  supportingText?: string;
  trailingSupportingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  interactive?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Official Material 3 List Item Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-list-item
 */
export const AppListItem: React.FC<AppListItemProps> = ({
  headline,
  supportingText,
  trailingSupportingText,
  startIcon,
  endIcon,
  leading,
  trailing,
  interactive,
  disabled = false,
  selected = false,
  onClick,
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const effectiveStart = startIcon || leading;
  const effectiveEnd = endIcon || trailing;

  return (
    <md-list-item
      disabled={disabled}
      selected={selected}
      onClick={disabled ? undefined : onClick}
      className={`text-right ${interactive ? "cursor-pointer" : ""} ${className}`}
    >
      {effectiveStart && <div slot="start">{effectiveStart}</div>}
      <div slot="headline">{headline}</div>
      {supportingText && <div slot="supporting-text">{supportingText}</div>}
      {trailingSupportingText && <div slot="trailing-supporting-text">{trailingSupportingText}</div>}
      {effectiveEnd && <div slot="end">{effectiveEnd}</div>}
    </md-list-item>
  );
};

export const AppList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <md-list className={`rounded-xl border border-[#DBE5DF] dark:border-[#3F4945] bg-[#FFFFFF] dark:bg-[#1D201E] ${className}`}>
      {children}
    </md-list>
  );
};
