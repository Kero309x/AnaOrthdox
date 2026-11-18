"use client";

import React, { useEffect, useRef, useState } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

export interface AppMenuProps {
  open?: boolean;
  anchorCorner?: string;
  menuCorner?: string;
  items: AppMenuItem[];
  onSelect?: (id: string) => void;
  onClose?: () => void;
  anchorEl?: HTMLElement | null;
  trigger?: React.ReactNode;
  className?: string;
}

/**
 * Official Material 3 Menu Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-menu
 * - md-menu-item
 */
export const AppMenu: React.FC<AppMenuProps> = ({
  open = false,
  items,
  onSelect,
  onClose,
  anchorEl,
  trigger,
  className = "",
}) => {
  const menuRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    initMaterialWeb();
  }, []);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (anchorEl) {
      menu.anchorElement = anchorEl;
    } else if (containerRef.current) {
      menu.anchorElement = containerRef.current;
    }

    const handleClosed = () => {
      setIsOpen(false);
      if (onClose) onClose();
    };

    menu.addEventListener("closed", handleClosed);
    return () => {
      menu.removeEventListener("closed", handleClosed);
    };
  }, [anchorEl, onClose]);

  const menuElement = (
    <md-menu
      ref={menuRef}
      open={isOpen}
      className={`text-right ${className}`}
    >
      {items.map((item) => (
        <md-menu-item
          key={item.id}
          disabled={item.disabled}
          onClick={() => {
            if (!item.disabled) {
              if (item.onClick) item.onClick();
              if (onSelect) onSelect(item.id);
              setIsOpen(false);
              if (onClose) onClose();
            }
          }}
        >
          {item.icon && <span slot="start">{item.icon}</span>}
          <div slot="headline" className={item.destructive ? "text-[#BA1A1A] font-semibold" : ""}>
            {item.label}
          </div>
        </md-menu-item>
      ))}
    </md-menu>
  );

  if (trigger) {
    return (
      <div ref={containerRef} className="relative inline-block">
        <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
          {trigger}
        </div>
        {menuElement}
      </div>
    );
  }

  return menuElement;
};
