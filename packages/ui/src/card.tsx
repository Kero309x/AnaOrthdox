"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "filled" | "outlined";
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Material 3 Expressive (M3E) Card Component
 * Thin typed React wrapper over <m3e-card> supporting:
 * - elevated (Elevation 1 with soft shadow)
 * - filled (Surface Container Highest tone)
 * - outlined (Outline Variant border)
 */
export const AppCard: React.FC<AppCardProps> = ({
  variant = "elevated",
  interactive = false,
  className = "",
  children,
  onClick,
  ...props
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  const variantStyles = {
    elevated:
      "bg-[#FFFFFF] text-[#191C1B] shadow-[0_1px_3px_1px_rgba(0,0,0,0.12)] border-0 dark:bg-[#1D201E] dark:text-[#E1E3DF]",
    filled:
      "bg-[#EFF2EE] text-[#191C1B] border-0 dark:bg-[#272B29] dark:text-[#E1E3DF]",
    outlined:
      "bg-[#FBFDF9] text-[#191C1B] border border-[#BFC9C3] dark:bg-[#191C1B] dark:text-[#E1E3DF] dark:border-[#3F4945]",
  };

  const interactiveStyles = interactive
    ? "cursor-pointer transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
    : "";

  return (
    <m3e-card
      variant={variant}
      className={`block rounded-2xl p-6 transition-colors ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </m3e-card>
  );
};

export const ElevatedCard: React.FC<Omit<AppCardProps, "variant">> = (props) => (
  <AppCard variant="elevated" {...props} />
);

export const FilledCard: React.FC<Omit<AppCardProps, "variant">> = (props) => (
  <AppCard variant="filled" {...props} />
);

export const OutlinedCard: React.FC<Omit<AppCardProps, "variant">> = (props) => (
  <AppCard variant="outlined" {...props} />
);
