"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppSwitchProps {
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  onChange?:
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((checked: boolean) => void);
  className?: string;
  id?: string;
}

/**
 * Official Material 3 Switch Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-switch
 */
export const AppSwitch: React.FC<AppSwitchProps> = ({
  selected,
  checked,
  disabled = false,
  label,
  name,
  value,
  onChange,
  className = "",
  id,
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const isSelected = selected ?? checked ?? false;

  const handleChange = (e: any) => {
    if (!onChange) return;
    if (typeof onChange === "function") {
      const isNowSelected = e.target?.selected ?? e.target?.checked ?? !isSelected;
      try {
        onChange(e);
      } catch {
        onChange(isNowSelected);
      }
    }
  };

  const switchElement = (
    <md-switch
      selected={isSelected}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      onChange={handleChange}
    />
  );

  if (!label) {
    return switchElement;
  }

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 select-none cursor-pointer text-sm font-medium text-[#191C1B] dark:text-[#E1E3DF] ${
        disabled ? "opacity-38 cursor-not-allowed" : ""
      } ${className}`}
    >
      {switchElement}
      <span>{label}</span>
    </label>
  );
};

export const Switch = AppSwitch;
