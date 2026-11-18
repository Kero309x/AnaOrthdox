"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppTextFieldProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  prefixText?: string;
  suffixText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "outlined" | "filled";
  name?: string;
  id?: string;
  className?: string;
  autoComplete?: string;
  dir?: string;
  minLength?: number;
  maxLength?: number;
}

/**
 * Official Material 3 Text Field Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-outlined-text-field
 * - md-filled-text-field
 */
export const AppTextField: React.FC<AppTextFieldProps> = ({
  label,
  value,
  defaultValue,
  onChange,
  onInput,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  error = false,
  errorText,
  supportingText,
  prefixText,
  suffixText,
  leadingIcon,
  trailingIcon,
  variant = "outlined",
  name,
  id,
  className = "",
  autoComplete,
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const sharedProps = {
    label,
    value,
    defaultValue,
    type,
    placeholder,
    disabled,
    required,
    readOnly,
    error,
    errorText,
    supportingText,
    prefixText,
    suffixText,
    name,
    id,
    autoComplete,
    className: `w-full text-right ${className}`,
    onChange,
    onInput,
  };

  const icons = (
    <>
      {leadingIcon && <span slot="leading-icon" className="inline-flex items-center">{leadingIcon}</span>}
      {trailingIcon && <span slot="trailing-icon" className="inline-flex items-center">{trailingIcon}</span>}
    </>
  );

  if (variant === "filled") {
    return <md-filled-text-field {...sharedProps}>{icons}</md-filled-text-field>;
  }

  return <md-outlined-text-field {...sharedProps}>{icons}</md-outlined-text-field>;
};
