import React from "react";

export interface AppLogoProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "squircle" | "mark" | "themed";
  size?: number | string;
  className?: string;
  alt?: string;
}

/**
 * Ana Orthodox Authentic Brand Logo Component
 * - "themed": Dynamic Material 3 Expressive squircle responding in real time to active M3 theme tokens
 * - "squircle": Official static image squircle asset (/brand/logo-squircle.png)
 * - "mark": Official static mark asset (/brand/logo-mark.png)
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  variant = "squircle",
  size = 40,
  className = "",
  alt = "أنا أرثوذكس — الشعار الرسمي",
  style,
  ...props
}) => {
  const dimension = typeof size === "number" ? `${size}px` : size;

  if (variant === "themed") {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex shrink-0 select-none items-center justify-center ${className}`}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: "var(--md-sys-shape-corner-medium, 12px)",
          background: "var(--md-sys-color-primary)",
          color: "var(--md-sys-color-on-primary)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          ...style,
        }}
        {...props}
      >
        <svg
          viewBox="0 0 48 48"
          fill="currentColor"
          style={{
            width: "65%",
            height: "65%",
            display: "block",
            transition: "fill 0.25s ease",
          }}
          aria-hidden="true"
        >
          {/* Vertical arm */}
          <rect x="21.75" y="9" width="4.5" height="30" rx="1.5" />
          {/* Horizontal arm */}
          <rect x="9" y="21.75" width="30" height="4.5" rx="1.5" />
          {/* Top trefoil buds */}
          <circle cx="24" cy="5.5" r="2.5" />
          <circle cx="20.5" cy="8" r="2.2" />
          <circle cx="27.5" cy="8" r="2.2" />
          {/* Bottom trefoil buds */}
          <circle cx="24" cy="42.5" r="2.5" />
          <circle cx="20.5" cy="40" r="2.2" />
          <circle cx="27.5" cy="40" r="2.2" />
          {/* Left trefoil buds */}
          <circle cx="5.5" cy="24" r="2.5" />
          <circle cx="8" cy="20.5" r="2.2" />
          <circle cx="8" cy="27.5" r="2.2" />
          {/* Right trefoil buds */}
          <circle cx="42.5" cy="24" r="2.5" />
          <circle cx="40" cy="20.5" r="2.2" />
          <circle cx="40" cy="27.5" r="2.2" />
          {/* Diagonal liturgical rays */}
          <line x1="19.5" y1="19.5" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="28.5" y1="19.5" x2="33" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="19.5" y1="28.5" x2="15" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="28.5" y1="28.5" x2="33" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Central halo circle */}
          <circle cx="24" cy="24" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    );
  }

  const src = variant === "squircle" ? "/brand/logo-squircle.png" : "/brand/logo-mark.png";

  return (
    <img
      src={src}
      alt={alt}
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      style={{ width: dimension, height: dimension, objectFit: "contain", ...style }}
      className={`inline-block shrink-0 select-none ${className}`}
      {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};
