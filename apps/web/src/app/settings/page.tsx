"use client";

import { useTheme, COLOR_SCHEMES, SeedColorId, Theme } from "../../context/theme-context";
import { AppRipple, AppLoadingIndicator } from "@ana-orthodox/ui";

export default function SettingsPage() {
  const { theme, seedColor, setTheme, setSeedColor } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: "light", label: "نهاري", icon: "light_mode" },
    { value: "dark", label: "ليلي", icon: "dark_mode" },
    { value: "system", label: "تلقائي", icon: "brightness_auto" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Container */}
      <section
        style={{
          borderRadius: "var(--md-sys-shape-corner-extra-large, 28px)",
          background: "var(--md-sys-color-surface-container-low)",
          border: "1px solid var(--md-sys-color-outline-variant)",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <span
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--md-sys-shape-corner-medium, 14px)",
            background: "var(--md-sys-color-primary-container)",
            color: "var(--md-sys-color-on-primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 28 }} aria-hidden="true">
            settings
          </span>
        </span>
        <h1
          style={{
            fontSize: "var(--md-sys-typescale-headline-small-size, 24px)",
            fontWeight: 800,
            color: "var(--md-sys-color-on-surface)",
            margin: 0,
          }}
        >
          الإعدادات
        </h1>
      </section>

      {/* =====================================================
          CATEGORY: THEME & DYNAMIC SEED COLOR (M3 MCU Dynamic Color)
          ===================================================== */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2
          style={{
            fontSize: "var(--md-sys-typescale-title-medium-size, 18px)",
            fontWeight: 700,
            color: "var(--md-sys-color-on-surface)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span className="material-symbols-rounded" style={{ color: "var(--md-sys-color-primary)", fontSize: 22 }} aria-hidden="true">
            palette
          </span>
          <span>المظهر وألوان السمة (Material 3 Dynamic Theme)</span>
        </h2>

        {/* Theme Mode Segmented Buttons */}
        <div
          style={{
            background: "var(--md-sys-color-surface-container-low)",
            borderRadius: "var(--md-sys-shape-corner-large, 16px)",
            border: "1px solid var(--md-sys-color-outline-variant)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "background-color 0.25s ease",
          }}
        >
          <label
            style={{
              fontSize: "var(--md-sys-typescale-label-large-size, 14px)",
              fontWeight: 700,
              color: "var(--md-sys-color-on-surface)",
            }}
          >
            نمط العرض (Theme Mode)
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
            role="radiogroup"
            aria-label="نمط المظهر"
          >
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "var(--md-sys-shape-corner-full)",
                    border: isSelected
                      ? "1px solid var(--md-sys-color-primary)"
                      : "1px solid var(--md-sys-color-outline-variant)",
                    background: isSelected
                      ? "var(--md-sys-color-primary-container)"
                      : "var(--md-sys-color-surface-container)",
                    color: isSelected
                      ? "var(--md-sys-color-on-primary-container)"
                      : "var(--md-sys-color-on-surface)",
                    cursor: "pointer",
                    fontSize: "var(--md-sys-typescale-label-large-size, 14px)",
                    fontWeight: isSelected ? 700 : 500,
                    transition: "all 0.2s ease",
                  }}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <AppRipple />
                  <span className="material-symbols-rounded" style={{ fontSize: 20 }} aria-hidden="true">
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Seed Color Picker */}
        <div
          style={{
            background: "var(--md-sys-color-surface-container-low)",
            borderRadius: "var(--md-sys-shape-corner-large, 16px)",
            border: "1px solid var(--md-sys-color-outline-variant)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "background-color 0.25s ease",
          }}
        >
          <label
            style={{
              fontSize: "var(--md-sys-typescale-label-large-size, 14px)",
              fontWeight: 700,
              color: "var(--md-sys-color-on-surface)",
            }}
          >
            اللون الأساسي للسمة (Material 3 Dynamic Palette Seed)
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
            }}
            role="radiogroup"
            aria-label="ألوان السمة"
          >
            {(Object.keys(COLOR_SCHEMES) as SeedColorId[]).map((colorKey) => {
              const scheme = COLOR_SCHEMES[colorKey];
              const isSelected = seedColor === colorKey;

              return (
                <button
                  key={colorKey}
                  onClick={() => setSeedColor(colorKey)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "var(--md-sys-shape-corner-large, 16px)",
                    border: isSelected
                      ? "2px solid var(--md-sys-color-primary)"
                      : "1px solid var(--md-sys-color-outline-variant)",
                    background: isSelected
                      ? "var(--md-sys-color-surface-container-lowest)"
                      : "var(--md-sys-color-surface-container)",
                    cursor: "pointer",
                    textAlign: "right",
                    transition: "all 0.2s ease",
                  }}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <AppRipple />
                  {/* Color Swatch Circle */}
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "var(--md-sys-shape-corner-full)",
                      background: scheme.seedHex,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      flexShrink: 0,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    {isSelected && (
                      <span className="material-symbols-rounded" style={{ fontSize: 18 }} aria-hidden="true">
                        check
                      </span>
                    )}
                  </span>

                  <span
                    style={{
                      fontSize: "var(--md-sys-typescale-label-medium-size, 13px)",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "var(--md-sys-color-on-surface)" : "var(--md-sys-color-on-surface-variant)",
                    }}
                  >
                    {scheme.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Material 3 Expressive Empty State: ONLY "قريباً" + M3 Expressive Icon */}
      <section
        style={{
          borderRadius: "var(--md-sys-shape-corner-extra-large, 28px)",
          background: "var(--md-sys-color-surface-container-low)",
          border: "1px dashed var(--md-sys-color-outline-variant)",
          padding: "72px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          textAlign: "center",
          minHeight: "260px",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
        aria-label="إعدادات إضافية قريباً"
      >
        <AppLoadingIndicator
          variant="contained"
          size="large"
          color="primary"
          aria-label="قريباً"
        />

        <h2
          style={{
            fontSize: "var(--md-sys-typescale-headline-small-size, 24px)",
            fontWeight: 700,
            color: "var(--md-sys-color-on-surface)",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          قريباً
        </h2>
      </section>
    </div>
  );
}
