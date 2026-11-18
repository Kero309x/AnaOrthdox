"use client";

import React, { useEffect, useRef } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Expressive (M3E) Bottom Sheet Component
 * Thin typed React wrapper over <m3e-bottom-sheet>
 */
export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
  className = "",
}) => {
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    initMaterialWeb();
  }, []);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    if (open && typeof el.show === "function") {
      el.show();
    } else if (!open && typeof el.close === "function") {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const handleClosed = () => {
      onClose();
    };

    el.addEventListener("closed", handleClosed);
    return () => {
      el.removeEventListener("closed", handleClosed);
    };
  }, [onClose]);

  return (
    <m3e-bottom-sheet
      ref={sheetRef}
      open={open}
      className={`text-right ${className}`}
    >
      {title && (
        <div slot="headline" className="text-lg font-bold text-[#191C1B] dark:text-[#E1E3DF] p-4 border-b border-[#DBE5DF] dark:border-[#3F4945]">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </m3e-bottom-sheet>
  );
};
