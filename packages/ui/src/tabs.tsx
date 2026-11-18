"use client";

import React, { useEffect, useRef } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface AppTabsProps {
  tabs: AppTabItem[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Official Material 3 Tabs Component
 * Thin typed React wrapper over @material/web custom elements:
 * - md-tabs
 * - md-primary-tab
 * - md-secondary-tab
 */
export const AppTabs: React.FC<AppTabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  variant = "primary",
  className = "",
}) => {
  const tabsRef = useRef<any>(null);

  useEffect(() => {
    initMaterialWeb();
  }, []);

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const handleTabChange = (e: any) => {
      const idx = e.target?.activeTabIndex ?? el.activeTabIndex;
      if (typeof idx === "number" && tabs[idx]) {
        onChange(tabs[idx].id);
      }
    };

    el.addEventListener("change", handleTabChange);
    return () => {
      el.removeEventListener("change", handleTabChange);
    };
  }, [tabs, onChange]);

  return (
    <div
      style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
      className="w-full max-w-full overflow-hidden"
    >
      <md-tabs
        ref={tabsRef}
        activeTabIndex={safeIndex}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          contain: "paint",
        }}
        className={`w-full max-w-full no-scrollbar ${className}`}
      >
        {tabs.map((tab) => {
          const tabContent = (
            <>
              {tab.icon && <span slot="icon">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  slot="badge"
                  className="rounded-full bg-[#D7F0E5] px-2 py-0.5 text-xs font-bold text-[#002018] dark:bg-[#00513F] dark:text-[#94F5DA]"
                >
                  {tab.badge}
                </span>
              )}
            </>
          );

          if (variant === "secondary") {
            return (
              <md-secondary-tab key={tab.id}>
                {tabContent}
              </md-secondary-tab>
            );
          }

          return (
            <md-primary-tab key={tab.id}>
              {tabContent}
            </md-primary-tab>
          );
        })}
      </md-tabs>
    </div>
  );
};
