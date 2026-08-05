import { defineConfig } from '@playwright/test';

// Predinštalovaný Chromium (lokálne). V CI je PW_CHROMIUM prázdne a použije sa
// prehliadač z `npx playwright install`.
const PW_CHROMIUM = process.env.PW_CHROMIUM;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      ...(PW_CHROMIUM ? { executablePath: PW_CHROMIUM } : {}),
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      // iPhone 17 (iOS 26) — logické rozlíšenie 402×874 @ 3x.
      // Engine je Chromium (WebKit build tu nie je), viewport a mobilné príznaky
      // zodpovedajú reálnemu zariadeniu.
      name: 'iphone-17',
      use: {
        browserName: 'chromium',
        viewport: { width: 402, height: 874 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
