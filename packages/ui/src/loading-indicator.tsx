"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppLoadingIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "contained" | "standalone";
  size?: "small" | "m" | "medium" | "large" | string;
  color?: "primary" | "secondary" | "tertiary" | string;
  indeterminate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official Material 3 Expressive Morphing Shape Loading Indicator (<md-loading-indicator>)
 * Direct web components adaptation of Material 3 Expressive from @materialwebunofficial/md3e-web.
 * Renders the authentic spring-physics shape morphing loading animation on HTML canvas.
 */
export const AppLoadingIndicator: React.FC<AppLoadingIndicatorProps> = ({
  variant = "contained",
  size = "large",
  color = "primary",
  indeterminate = true,
  className = "",
  style,
  ...props
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <md-loading-indicator
      variant={variant}
      size={size}
      color={color}
      indeterminate={indeterminate}
      className={`inline-block ${className}`}
      style={style}
      {...props}
    />
  );
};

export const LoadingIndicator = AppLoadingIndicator;
