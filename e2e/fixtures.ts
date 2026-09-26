import { test as base, expect, type Page } from "@playwright/test";
import knownMissingImages from "../src/__tests__/known-missing-images.json";

// Ads and analytics are third-party: block them so tests are fast, deterministic
// and don't fail on the ad network's own console noise.
const THIRD_PARTY = /googlesyndication|doubleclick|googletagmanager|google-analytics|adtrafficquality|fundingchoices/;

// Images already known to be missing (see src/__tests__/known-missing-images.json).
const isKnownMissingImage = (url: string) =>
  knownMissingImages.some((image) => url.includes(encodeURIComponent(image)) || url.endsWith(image));

export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    await page.route(THIRD_PARTY, (route) => route.abort());
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      const knownImage = isKnownMissingImage(message.location().url ?? "");
      if (message.type() === "error" && !knownImage && !/adsbygoogle|ERR_FAILED|net::/.test(message.text())) {
        errors.push(`console: ${message.text()}`);
      }
    });
    page.on("requestfailed", (request) => {
      // ERR_ABORTED is Next.js cancelling a link prefetch, not a failure.
      const aborted = /ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i.test(request.failure()?.errorText ?? "");
      if (!THIRD_PARTY.test(request.url()) && !aborted) {
        errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`);
      }
    });
    await use(errors);
  },
});

export async function screenshot(page: Page, name: string, project: string) {
  await page.screenshot({ path: `e2e/screenshots/${project}/${name}.png`, fullPage: true });
}

export { expect };
