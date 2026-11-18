"use client";

import React, { useEffect, useRef } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Official Material 3 Dialog Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-dialog
 */
export const AppDialog: React.FC<AppDialogProps> = ({
  open,
  isOpen,
  onClose,
  title,
  icon,
  children,
  actions,
  className = "",
}) => {
  const isDialogOpen = Boolean(open ?? isOpen ?? false);
  const dialogRef = useRef<any>(null);

  useEffect(() => {
    initMaterialWeb();
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (isDialogOpen && typeof el.show === "function") {
      el.show();
    } else if (!isDialogOpen && typeof el.close === "function") {
      el.close();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    const el = dialogRef.current;
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
    <md-dialog
      ref={dialogRef}
      open={isDialogOpen}
      className={`text-right ${className}`}
    >
      {icon && <div slot="icon" className="text-2xl">{icon}</div>}
      <div slot="headline" className="text-lg font-bold text-[#191C1B] dark:text-[#E1E3DF]">
        {title}
      </div>
      <div slot="content" className="text-sm text-[#4C635A] dark:text-[#B2CCC1] leading-relaxed py-2">
        {children}
      </div>
      {actions && (
        <div slot="actions" className="flex items-center justify-end gap-2 pt-2">
          {actions}
        </div>
      )}
    </md-dialog>
  );
};

export const Dialog = AppDialog;
