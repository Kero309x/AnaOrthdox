"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppRippleProps extends React.HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  className?: string;
}

/**
 * Official Material 3 Ink Ripple Element (<md-ripple>)
 * Provides authentic Google Material 3 ink ripple animations and interactive state layers
 * (Hover: 8%, Focus: 12%, Pressed ripple expansion).
 * Place inside any container with `position: relative` and `overflow: hidden`.
 */
export const AppRipple: React.FC<AppRippleProps> = ({ disabled = false, className = "", ...props }) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return <md-ripple disabled={disabled} className={`pointer-events-none absolute inset-0 ${className}`} {...props} />;
};
