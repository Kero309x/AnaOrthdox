import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-card": React.HTMLAttributes<HTMLElement> & {
        variant?: "elevated" | "filled" | "outlined";
        interactive?: boolean;
        disabled?: boolean;
        href?: string;
        className?: string;
        style?: React.CSSProperties;
      };
      "md-button": React.HTMLAttributes<HTMLElement> & {
        variant?: "filled" | "outlined" | "tonal" | "elevated" | "text";
        disabled?: boolean;
        icon?: string;
        trailingIcon?: string;
        href?: string;
        target?: string;
        label?: string;
        size?: "s" | "m" | "l" | "xl";
        className?: string;
        style?: React.CSSProperties;
      };
      "md-chip": React.HTMLAttributes<HTMLElement> & {
        variant?: "assist" | "filter" | "input" | "suggestion" | "action";
        elevated?: boolean;
        label?: string;
        icon?: string;
        trailingIcon?: string;
        expressive?: boolean;
        selected?: boolean;
        disabled?: boolean;
        className?: string;
        style?: React.CSSProperties;
      };
      "md-switch": React.HTMLAttributes<HTMLElement> & {
        checked?: boolean;
        disabled?: boolean;
        name?: string;
        value?: string;
        required?: boolean;
        icon?: string;
        className?: string;
        style?: React.CSSProperties;
      };
      "md-badge": React.HTMLAttributes<HTMLElement> & {
        value?: string | number;
        max?: number;
        className?: string;
        style?: React.CSSProperties;
      };
      "md-divider": React.HTMLAttributes<HTMLElement> & {
        inset?: boolean;
        className?: string;
        style?: React.CSSProperties;
      };
      "md-icon-button": React.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        href?: string;
        className?: string;
        style?: React.CSSProperties;
      };
    }
  }
}
