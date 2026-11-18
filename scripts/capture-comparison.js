const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const artifactDir = "C:\\Users\\Kero309x\\.gemini\\antigravity\\brain\\35fffd56-ffb2-4ed5-adff-0329c37f27ec";
const evidenceDir = path.resolve(__dirname, "..", "docs", "ui-evidence", "m3-comparison");

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const tempProfile = path.join(os.tmpdir(), "chrome_comparison_profile");

const captures = [
  { url: "http://localhost:3000/", name: "our-app-home-desktop.png", w: 1440, h: 900 },
  { url: "http://localhost:3000/settings", name: "our-app-settings-desktop.png", w: 1440, h: 900 },
  { url: "https://materialwebunofficial.github.io/", name: "reference-website-desktop.png", w: 1440, h: 900 }
];

for (const cap of captures) {
  const evPath = path.join(evidenceDir, cap.name);
  const artPath = path.join(artifactDir, cap.name);
  const cmd = `"${chromePath}" --headless=new --user-data-dir="${tempProfile}" --hide-scrollbars --window-size=${cap.w},${cap.h} --screenshot="${evPath}" "${cap.url}"`;
  try {
    console.log(`Capturing ${cap.url} ...`);
    execSync(cmd, { stdio: "pipe", timeout: 35000 });
    fs.copyFileSync(evPath, artPath);
    console.log(`[PASS] Captured ${cap.name} (${fs.statSync(evPath).size} bytes)`);
  } catch (err) {
    console.error(`[FAIL] ${cap.name}:`, err.message);
  }
}

console.log("Comparison captures complete.");
