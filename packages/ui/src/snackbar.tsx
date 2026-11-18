"use client";

import React, { useEffect, useRef } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppSnackbarProps {
  open?: boolean;
  isOpen?: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  autoHideDuration?: number;
  className?: string;
}

/**
 * Material 3 Expressive (M3E) Snackbar Component
 * Thin typed React wrapper over <m3e-snackbar>
 */
export const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  isOpen,
  message,
  actionLabel,
  onAction,
  onClose,
  autoHideDuration = 4000,
  className = "",
}) => {
  const isSnackbarOpen = Boolean(open ?? isOpen ?? false);
  const snackbarRef = useRef<any>(null);

  useEffect(() => {
    initMaterialWeb();
  }, []);

  useEffect(() => {
    if (!isSnackbarOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);
    return () => clearTimeout(timer);
  }, [isSnackbarOpen, autoHideDuration, onClose]);

  if (!isSnackbarOpen) return null;

  return (
    <div className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 select-none ${className}`}>
      <m3e-snackbar
        ref={snackbarRef}
        open={isSnackbarOpen}
        className="flex items-center justify-between gap-4 rounded-xl bg-[#2E312F] text-[#F0F1ED] px-4 py-3 shadow-lg dark:bg-[#E1E3DF] dark:text-[#191C1B]"
      >
        <span className="text-sm font-medium">{message}</span>
        {actionLabel && (
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className="text-sm font-bold text-[#77D8BE] dark:text-[#145A48] hover:underline focus:outline-none"
          >
            {actionLabel}
          </button>
        )}
      </m3e-snackbar>
    </div>
  );
};

export const Snackbar = AppSnackbar;
