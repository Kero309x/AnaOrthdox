import React from "react";

export interface NavDestination {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  href: string;
  isActive?: boolean;
  badge?: string | number;
}

export interface AppTopAppBarProps {
  title: string;
  leadingIcon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Top App Bar (Center-aligned / Small)
 * Standard 64px height with sticky surface background and subtle border.
 */
export const AppTopAppBar: React.FC<AppTopAppBarProps> = ({
  title,
  leadingIcon,
  actions,
  className = "",
}) => {
  return (
    <header
      className={`sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8 ${className}`}
    >
      <div className="flex items-center gap-3">
        {leadingIcon && <div className="shrink-0">{leadingIcon}</div>}
        <h1 className="text-lg font-bold text-[var(--md-sys-color-primary)]">{title}</h1>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export interface AppNavigationBarProps {
  destinations: NavDestination[];
  className?: string;
  onNavigate?: (dest: NavDestination) => void;
}

/**
 * Material 3 Navigation Bar (Bottom Bar for Compact Viewports)
 * Standard 80px height with active indicator pill (64x32px) and label.
 */
export const AppNavigationBar: React.FC<AppNavigationBarProps> = ({
  destinations,
  className = "",
  onNavigate,
}) => {
  return (
    <nav
      aria-label="التنقل الرئيسي المدمج"
      className={`fixed bottom-0 left-0 right-0 z-40 flex h-20 w-full items-center justify-around border-t border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-2 ${className}`}
    >
      {destinations.map((dest) => {
        const isActive = dest.isActive;
        return (
          <a
            key={dest.id}
            href={dest.href}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(dest);
              }
            }}
            className="flex flex-col items-center justify-center gap-1 text-center select-none"
          >
            <div
              className={`flex h-8 w-16 items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "bg-[#D7F0E5] bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]"
                  : "text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]"
              }`}
            >
              <span className="text-xl">
                {isActive && dest.activeIcon ? dest.activeIcon : dest.icon}
              </span>
            </div>
            <span
              className={`text-xs font-medium ${
                isActive
                  ? "font-bold text-[var(--md-sys-color-primary)]"
                  : "text-[var(--md-sys-color-on-surface-variant)]"
              }`}
            >
              {dest.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export interface AppNavigationRailProps {
  destinations: NavDestination[];
  headerAction?: React.ReactNode;
  className?: string;
  onNavigate?: (dest: NavDestination) => void;
}

/**
 * Material 3 Navigation Rail (Vertical side navigation for Medium / Tablet Viewports)
 * Standard 80px width with top-to-bottom destinations and FAB slot.
 */
export const AppNavigationRail: React.FC<AppNavigationRailProps> = ({
  destinations,
  headerAction,
  className = "",
  onNavigate,
}) => {
  return (
    <aside
      aria-label="شريط التنقل الجانبي"
      className={`sticky top-0 flex h-screen w-20 flex-col items-center border-l border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] py-4 shrink-0 ${className}`}
    >
      {headerAction && <div className="mb-6">{headerAction}</div>}

      <div className="flex flex-1 flex-col items-center gap-4">
        {destinations.map((dest) => {
          const isActive = dest.isActive;
          return (
            <a
              key={dest.id}
              href={dest.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(dest);
                }
              }}
              className="flex flex-col items-center gap-1 text-center select-none"
            >
              <div
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]"
                    : "text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]"
                }`}
              >
                <span className="text-xl">
                  {isActive && dest.activeIcon ? dest.activeIcon : dest.icon}
                </span>
              </div>
              <span
                className={`text-[11px] font-medium leading-tight ${
                  isActive
                    ? "font-bold text-[var(--md-sys-color-primary)]"
                    : "text-[var(--md-sys-color-on-surface-variant)]"
                }`}
              >
                {dest.label}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};
