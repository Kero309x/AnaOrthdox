"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

/**
 * Official Material 3 Checkbox Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-checkbox
 */
export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  label,
  name,
  value,
  onChange,
  className = "",
  id,
}) => {
  const isChecked = checked ?? defaultChecked ?? false;
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const handleChange = (e: any) => {
    if (!onChange) return;
    if (typeof onChange === "function") {
      const isNowChecked = e.target?.checked ?? !isChecked;
      try {
        onChange(e);
      } catch {
        onChange(isNowChecked);
      }
    }
  };

  const checkbox = (
    <md-checkbox
      checked={isChecked}
      indeterminate={indeterminate}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      onChange={handleChange}
    />
  );

  if (!label) {
    return checkbox;
  }

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer text-sm font-medium text-[#191C1B] dark:text-[#E1E3DF] ${
        disabled ? "opacity-38 cursor-not-allowed" : ""
      } ${className}`}
    >
      {checkbox}
      <span>{label}</span>
    </label>
  );
};

export const Checkbox = AppCheckbox;
