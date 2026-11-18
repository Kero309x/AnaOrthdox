"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppRadioProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

/**
 * Official Material 3 Radio Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-radio
 */
export const AppRadio: React.FC<AppRadioProps> = ({
  checked = false,
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

  const radio = (
    <md-radio
      checked={checked}
      disabled={disabled}
      name={name}
      value={value}
      id={id}
      onChange={onChange}
    />
  );

  if (!label) {
    return radio;
  }

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer text-sm font-medium text-[#191C1B] dark:text-[#E1E3DF] ${
        disabled ? "opacity-38 cursor-not-allowed" : ""
      } ${className}`}
    >
      {radio}
      <span>{label}</span>
    </label>
  );
};
