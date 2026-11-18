const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const artifactDir = "C:\\Users\\Kero309x\\.gemini\\antigravity\\brain\\35fffd56-ffb2-4ed5-adff-0329c37f27ec";
const evidenceDir = path.resolve(__dirname, "..", "docs", "ui-evidence", "m3-expressive-final");

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const targets = [
  { url: "http://localhost:3000/", name: "home" },
  { url: "http://localhost:3000/account", name: "account" },
  { url: "http://localhost:3000/settings", name: "settings" },
];

const viewports = [
  { w: 1920, h: 1080, suffix: "desktop-1920x1080" },
  { w: 390, h: 844, suffix: "mobile-390x844" },
];

const tempProfile = path.join(os.tmpdir(), "chrome_headless_profile");

for (const target of targets) {
  for (const vp of viewports) {
    const filename = `${target.name}-${vp.suffix}.png`;
    const evidencePath = path.join(evidenceDir, filename);
    const artifactPath = path.join(artifactDir, filename);

    const cmd = `"${chromePath}" --headless=new --user-data-dir="${tempProfile}" --hide-scrollbars --window-size=${vp.w},${vp.h} --screenshot="${evidencePath}" "${target.url}"`;
    try {
      execSync(cmd, { stdio: "pipe", timeout: 25000 });
      fs.copyFileSync(evidencePath, artifactPath);
      const stat = fs.statSync(evidencePath);
      console.log(`[PASS] Captured ${filename} (${stat.size} bytes)`);
    } catch (err) {
      console.error(`[FAIL] ${filename}:`, err.message);
    }
  }
}

console.log("Screenshots captured successfully.");
