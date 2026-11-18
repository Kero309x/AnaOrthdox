"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppDividerProps {
  inset?: boolean;
  insetStart?: boolean;
  insetEnd?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Official Material 3 Divider Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-divider
 */
export const AppDivider: React.FC<AppDividerProps> = ({
  inset = false,
  insetStart = false,
  insetEnd = false,
  orientation = "horizontal",
  className = "",
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <md-divider
      inset={inset}
      inset-start={insetStart}
      inset-end={insetEnd}
      className={`${orientation === "vertical" ? "h-full inline-block mx-2" : "w-full block my-2"} ${className}`}
    />
  );
};

export const Divider = AppDivider;
