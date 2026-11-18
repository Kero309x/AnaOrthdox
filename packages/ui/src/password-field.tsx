"use client";

import React, { useState } from "react";
import { AppTextField, AppTextFieldProps } from "./text-field";

export interface AppPasswordFieldProps extends Omit<AppTextFieldProps, "type" | "trailingIcon"> {
  showToggle?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Material 3 Password Field Component
 * Extends AppTextField with an interactive trailing toggle to reveal/hide characters.
 */
export const AppPasswordField: React.FC<AppPasswordFieldProps> = ({
  showToggle = true,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const toggleIcon = showToggle ? (
    <button
      type="button"
      onClick={() => setVisible((prev) => !prev)}
      aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
      className="p-1 text-base text-[#6F7975] hover:text-[#145A48] dark:text-[#89938E] dark:hover:text-[#77D8BE] transition-colors focus:outline-none"
    >
      {visible ? "👁️" : "🙈"}
    </button>
  ) : undefined;

  return (
    <AppTextField
      type={visible ? "text" : "password"}
      trailingIcon={toggleIcon}
      {...props}
    />
  );
};

export const PasswordField = AppPasswordField;
