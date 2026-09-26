import { defineConfig, devices } from "@playwright/test";

// BASE_URL runs the same suite against a Vercel preview or production.
const port = 3100;
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

// CI adds Firefox and WebKit; locally Chromium desktop + mobile is enough.
const extraBrowsers = process.env.CI
  ? [
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
      { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ]
  : [];

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL, trace: "retain-on-failure", locale: "en-US" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    ...extraBrowsers,
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
