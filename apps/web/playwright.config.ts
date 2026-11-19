import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, retries: 0,
  reporter: [['list'], ['html', {open:'never'}]],
  use: { baseURL: 'http://127.0.0.1:3000', locale: 'ar-EG', timezoneId: 'Africa/Cairo', trace: 'retain-on-failure',
    launchOptions: process.env.CHROME_BIN ? {executablePath:process.env.CHROME_BIN} : {},
  },
  projects: [
 {name:'phone-320',use:{viewport:{width:320,height:800},browserName:'chromium'}},
 {name:'phone-390',use:{viewport:{width:390,height:844},browserName:'chromium'}},
 {name:'desktop-1280',use:{viewport:{width:1280,height:900},browserName:'chromium'}},
 ],
  webServer: { command: 'pnpm start', url:'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI, timeout:60000 },
});
