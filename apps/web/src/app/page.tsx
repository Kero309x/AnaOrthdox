"use client";

import { AppLoadingIndicator } from "@ana-orthodox/ui";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Title */}
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
            home
          </span>
        </span>
        <h1
          style={{
            fontSize: "var(--md-sys-typescale-headline-small-size, 24px)",
            fontWeight: 700,
            color: "var(--md-sys-color-on-surface)",
            margin: 0,
          }}
        >
          الرئيسية
        </h1>
      </section>

      {/* Material 3 Expressive State: Official Morphing Shape Canvas Loading Indicator (<md-loading-indicator>) */}
      <section
        style={{
          borderRadius: "var(--md-sys-shape-corner-extra-large, 28px)",
          background: "var(--md-sys-color-surface-container-low)",
          border: "1px solid var(--md-sys-color-outline-variant)",
          padding: "96px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          textAlign: "center",
          minHeight: "360px",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
        aria-label="محتوى الصفحة قريباً"
      >
        {/* Authentic Material 3 Expressive Morphing Shape Canvas Loading Indicator */}
        <AppLoadingIndicator
          variant="contained"
          size="large"
          color="primary"
          aria-label="قريباً"
        />

        {/* The single clean word: قريباً */}
        <h2
          style={{
            fontSize: "var(--md-sys-typescale-headline-medium-size, 28px)",
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
