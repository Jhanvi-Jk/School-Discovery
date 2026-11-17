import { defineConfig } from "@playwright/test";

// E2E tests run against an already-running site: `npm run dev` locally, or a preview URL in CI.
//   E2E_BASE_URL=https://preview.example.com npm run test:e2e
export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    channel: process.env.PW_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1400, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true }, grep: /@mobile/ },
  ],
});
