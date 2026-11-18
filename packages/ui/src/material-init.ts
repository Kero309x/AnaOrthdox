"use client";

let initialized = false;

/**
 * Initializes and registers Official Material Web and M3E Web Components in the browser.
 * Safe for Next.js SSR - only executes when window is available.
 */
export function initMaterialWeb(): void {
  if (typeof window === "undefined" || initialized) {
    return;
  }
  initialized = true;

  try {
    // Official Material Web Components (@material/web)
    import("@material/web/button/filled-button.js");
    import("@material/web/button/outlined-button.js");
    import("@material/web/button/text-button.js");
    import("@material/web/button/elevated-button.js");
    import("@material/web/button/filled-tonal-button.js");
    import("@material/web/iconbutton/icon-button.js");
    import("@material/web/iconbutton/filled-icon-button.js");
    import("@material/web/iconbutton/outlined-icon-button.js");
    import("@material/web/textfield/filled-text-field.js");
    import("@material/web/textfield/outlined-text-field.js");
    import("@material/web/checkbox/checkbox.js");
    import("@material/web/switch/switch.js");
    import("@material/web/radio/radio.js");
    import("@material/web/slider/slider.js");
    import("@material/web/dialog/dialog.js");
    import("@material/web/progress/circular-progress.js");
    import("@material/web/progress/linear-progress.js");
    import("@material/web/divider/divider.js");
    import("@material/web/fab/fab.js");
    import("@material/web/tabs/tabs.js");
    import("@material/web/tabs/primary-tab.js");
    import("@material/web/tabs/secondary-tab.js");
    import("@material/web/chips/chip-set.js");
    import("@material/web/chips/assist-chip.js");
    import("@material/web/chips/filter-chip.js");
    import("@material/web/select/filled-select.js");
    import("@material/web/select/outlined-select.js");
    import("@material/web/select/select-option.js");
    import("@material/web/menu/menu.js");
    import("@material/web/menu/menu-item.js");
    import("@material/web/list/list.js");
    import("@material/web/list/list-item.js");
    import("@material/web/ripple/ripple.js");
    import("@material/web/elevation/elevation.js");

    // Material 3 Expressive Components (@m3e/web)
    import("@m3e/web/card");
    import("@m3e/web/bottom-sheet");
    import("@m3e/web/skeleton");
    import("@m3e/web/snackbar");

    // Reference D — Material Web Unofficial / MD3E Web (@materialwebunofficial/md3e-web)
    import("@materialwebunofficial/md3e-web");
  } catch (e) {
    console.warn("Failed to dynamically register Material Web components:", e);
  }
}

// Auto-initialize immediately if loaded in a client environment
if (typeof window !== "undefined") {
  initMaterialWeb();
}
