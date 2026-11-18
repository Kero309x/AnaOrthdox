import * as React from "react";

type MaterialElementProps<T = HTMLElement> = React.HTMLAttributes<T> & {
  disabled?: boolean;
  name?: string;
  value?: any;
  label?: string;
  type?: string;
  variant?: string;
  selected?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  open?: boolean;
  active?: boolean;
  href?: string;
  target?: string;
  hasIcon?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  prefixText?: string;
  suffixText?: string;
  icon?: string;
  trailingIcon?: boolean;
  min?: any;
  max?: any;
  step?: any;
  labeled?: boolean;
  ticks?: boolean;
  inset?: boolean;
  "inset-start"?: boolean;
  "inset-end"?: boolean;
  "active-tab-index"?: number;
  activeTabIndex?: number;
  [key: string]: any;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": MaterialElementProps;
      "md-outlined-button": MaterialElementProps;
      "md-text-button": MaterialElementProps;
      "md-elevated-button": MaterialElementProps;
      "md-tonal-button": MaterialElementProps;
      "md-filled-tonal-button": MaterialElementProps;
      "md-icon-button": MaterialElementProps;
      "md-filled-icon-button": MaterialElementProps;
      "md-filled-tonal-icon-button": MaterialElementProps;
      "md-outlined-icon-button": MaterialElementProps;
      "md-filled-text-field": MaterialElementProps;
      "md-outlined-text-field": MaterialElementProps;
      "md-checkbox": MaterialElementProps;
      "md-switch": MaterialElementProps;
      "md-radio": MaterialElementProps;
      "md-slider": MaterialElementProps;
      "md-dialog": MaterialElementProps;
      "md-circular-progress": MaterialElementProps;
      "md-linear-progress": MaterialElementProps;
      "md-divider": MaterialElementProps;
      "md-fab": MaterialElementProps;
      "md-tabs": MaterialElementProps;
      "md-primary-tab": MaterialElementProps;
      "md-secondary-tab": MaterialElementProps;
      "md-chip-set": MaterialElementProps;
      "md-assist-chip": MaterialElementProps;
      "md-filter-chip": MaterialElementProps;
      "md-input-chip": MaterialElementProps;
      "md-suggestion-chip": MaterialElementProps;
      "md-filled-select": MaterialElementProps;
      "md-outlined-select": MaterialElementProps;
      "md-select-option": MaterialElementProps;
      "md-menu": MaterialElementProps;
      "md-menu-item": MaterialElementProps;
      "md-list": MaterialElementProps;
      "md-list-item": MaterialElementProps;
      "md-ripple": MaterialElementProps;
      "md-elevation": MaterialElementProps;
      "md-loading-indicator": MaterialElementProps;
      "md-progress-indicator": MaterialElementProps;
      "m3e-card": MaterialElementProps;
      "m3e-bottom-sheet": MaterialElementProps;
      "m3e-skeleton": MaterialElementProps;
      "m3e-snackbar": MaterialElementProps;
    }
  }

  namespace React.JSX {
    interface IntrinsicElements {
      "md-filled-button": MaterialElementProps;
      "md-outlined-button": MaterialElementProps;
      "md-text-button": MaterialElementProps;
      "md-elevated-button": MaterialElementProps;
      "md-tonal-button": MaterialElementProps;
      "md-filled-tonal-button": MaterialElementProps;
      "md-icon-button": MaterialElementProps;
      "md-filled-icon-button": MaterialElementProps;
      "md-filled-tonal-icon-button": MaterialElementProps;
      "md-outlined-icon-button": MaterialElementProps;
      "md-filled-text-field": MaterialElementProps;
      "md-outlined-text-field": MaterialElementProps;
      "md-checkbox": MaterialElementProps;
      "md-switch": MaterialElementProps;
      "md-radio": MaterialElementProps;
      "md-slider": MaterialElementProps;
      "md-dialog": MaterialElementProps;
      "md-circular-progress": MaterialElementProps;
      "md-linear-progress": MaterialElementProps;
      "md-divider": MaterialElementProps;
      "md-fab": MaterialElementProps;
      "md-tabs": MaterialElementProps;
      "md-primary-tab": MaterialElementProps;
      "md-secondary-tab": MaterialElementProps;
      "md-chip-set": MaterialElementProps;
      "md-assist-chip": MaterialElementProps;
      "md-filter-chip": MaterialElementProps;
      "md-input-chip": MaterialElementProps;
      "md-suggestion-chip": MaterialElementProps;
      "md-filled-select": MaterialElementProps;
      "md-outlined-select": MaterialElementProps;
      "md-select-option": MaterialElementProps;
      "md-menu": MaterialElementProps;
      "md-menu-item": MaterialElementProps;
      "md-list": MaterialElementProps;
      "md-list-item": MaterialElementProps;
      "md-ripple": MaterialElementProps;
      "md-elevation": MaterialElementProps;
      "md-loading-indicator": MaterialElementProps;
      "md-progress-indicator": MaterialElementProps;
      "m3e-card": MaterialElementProps;
      "m3e-bottom-sheet": MaterialElementProps;
      "m3e-skeleton": MaterialElementProps;
      "m3e-snackbar": MaterialElementProps;
    }
  }
}

declare module "@m3e/web/card";
declare module "@m3e/web/bottom-sheet";
declare module "@m3e/web/skeleton";
declare module "@m3e/web/snackbar";
