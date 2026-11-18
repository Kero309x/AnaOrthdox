const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = path.resolve(__dirname, "..", "docs", "ui-evidence", "phase-ui-rebuild-01");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { w: 320, h: 568, name: "mobile-320x568" },
  { w: 360, h: 800, name: "mobile-360x800" },
  { w: 390, h: 844, name: "mobile-390x844" },
  { w: 430, h: 932, name: "mobile-430x932" },
  { w: 768, h: 1024, name: "tablet-768x1024" },
  { w: 1024, h: 768, name: "tablet-landscape-1024x768" },
  { w: 1280, h: 800, name: "desktop-1280x800" },
  { w: 1440, h: 900, name: "desktop-1440x900" },
  { w: 1920, h: 1080, name: "desktop-1920x1080" },
  { w: 2560, h: 1440, name: "desktop-2560x1440" },
];

function capture(url, width, height, filename) {
  const targetFile = path.join(outDir, filename);
  const cmd = `"${chromePath}" --headless=new --hide-scrollbars --window-size=${width},${height} --screenshot="${targetFile}" "${url}"`;
  try {
    execSync(cmd, { stdio: "pipe", timeout: 15000 });
    const stats = fs.statSync(targetFile);
    console.log(`[PASS] Captured ${filename} (${stats.size} bytes)`);
  } catch (err) {
    console.error(`[FAIL] Could not capture ${filename}:`, err.message);
  }
}

console.log("=== Capturing Viewport Matrix for Homepage (/) ===");
for (const vp of viewports) {
  capture("http://localhost:3000", vp.w, vp.h, `home-${vp.name}.png`);
}

console.log("\n=== Capturing Component Showcase (/dev/components) ===");
capture("http://localhost:3000/dev/components", 1920, 1080, "dev-components-desktop-1920x1080.png");
capture("http://localhost:3000/dev/components", 768, 1024, "dev-components-tablet-768x1024.png");
capture("http://localhost:3000/dev/components", 390, 844, "dev-components-mobile-390x844.png");

console.log("\n=== Capturing Calendar Converter (/calendar) ===");
capture("http://localhost:3000/calendar", 1920, 1080, "calendar-desktop-1920x1080.png");
capture("http://localhost:3000/calendar", 768, 1024, "calendar-tablet-768x1024.png");
capture("http://localhost:3000/calendar", 390, 844, "calendar-mobile-390x844.png");

console.log("\n=== Capturing Account Screen (/account) ===");
capture("http://localhost:3000/account", 1920, 1080, "account-desktop-1920x1080.png");
capture("http://localhost:3000/account", 390, 844, "account-mobile-390x844.png");

console.log("\n=== Capturing Design System (/design-system) ===");
capture("http://localhost:3000/design-system", 1920, 1080, "design-system-desktop-1920x1080.png");

console.log("\nAll screenshots generated in:", outDir);
