"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps {
  label: string;
  value?: string;
  options: AppSelectOption[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  variant?: "outlined" | "filled";
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  supportingText?: string;
}

/**
 * Official Material 3 Select Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-outlined-select / md-filled-select
 * - md-select-option
 */
export const AppSelect: React.FC<AppSelectProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  required = false,
  variant = "outlined",
  name,
  id,
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const sharedProps = {
    label,
    value,
    disabled,
    required,
    name,
    id,
    className: `w-full text-right ${className}`,
    onChange,
  };

  const optionElements = options.map((opt) => (
    <md-select-option key={opt.value} value={opt.value} disabled={opt.disabled}>
      <div slot="headline">{opt.label}</div>
    </md-select-option>
  ));

  if (variant === "filled") {
    return <md-filled-select {...sharedProps}>{optionElements}</md-filled-select>;
  }

  return <md-outlined-select {...sharedProps}>{optionElements}</md-outlined-select>;
};
