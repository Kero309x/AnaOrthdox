import React from "react";

export interface NavigationDrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface AppNavigationDrawerProps {
  headline?: React.ReactNode;
  items: NavigationDrawerItem[];
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Navigation Drawer
 * Follows M3 Drawer guidelines: 360px max width, rounded-r-[28px] (in LTR) or rounded-l-[28px] (in RTL),
 * active indicator container shape (rounded-full 56px height pill).
 */
export const AppNavigationDrawer: React.FC<AppNavigationDrawerProps> = ({
  headline,
  items,
  footer,
  className = "",
}) => {
  return (
    <aside
      aria-label="القائمة الجانبية للتنقل"
      className={
        "flex flex-col h-full w-72 md:w-80 bg-[#F8FAF8] dark:bg-[#111413] " +
        "border-e border-[#E0E3E0] dark:border-[#262B28] p-3 gap-2 " +
        className
      }
    >
      {headline && <div className="px-4 py-3 shrink-0">{headline}</div>}

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto" role="navigation">
        {items.map((item) => {
          const isActive = item.active;
          const content = (
            <>
              <span
                className={
                  "inline-flex shrink-0 text-xl transition-colors " +
                  (isActive
                    ? "text-[#145A48] dark:text-[#77D8BE]"
                    : "text-[#49454F] dark:text-[#CAC4D0]")
                }
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="flex-1 font-medium text-sm text-start truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={
                    "text-xs px-2 py-0.5 rounded-full font-bold " +
                    (isActive
                      ? "bg-[#145A48] text-white dark:bg-[#77D8BE] dark:text-[#00382B]"
                      : "bg-[#E0E3E0] text-[#49454F] dark:bg-[#262B28] dark:text-[#CAC4D0]")
                  }
                >
                  {item.badge}
                </span>
              )}
            </>
          );

          const itemClasses =
            "relative flex items-center gap-3 px-4 h-14 rounded-full select-none cursor-pointer " +
            "transition-[background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145A48] " +
            (isActive
              ? "bg-[#D7F0E5] text-[#002018] font-semibold dark:bg-[#00513F] dark:text-[#94F5DA]"
              : "text-[#1D1B20] dark:text-[#E6E1E5] hover:bg-[#E8EDE9] dark:hover:bg-[#1D2220]");

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                className={itemClasses}
                aria-current={isActive ? "page" : undefined}
                onClick={item.onClick}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={itemClasses}
              aria-current={isActive ? "page" : undefined}
              onClick={item.onClick}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {footer && (
        <div className="pt-2 border-t border-[#E0E3E0] dark:border-[#262B28]">{footer}</div>
      )}
    </aside>
  );
};

export const NavigationDrawer = AppNavigationDrawer;
