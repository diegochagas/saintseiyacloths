import { test, expect, screenshot } from "./fixtures";

// The locale comes from the NEXT_LOCALE cookie (falling back to Accept-Language).
for (const locale of ["en", "pt", "es", "fr"]) {
  test(`home renders in ${locale}`, async ({ page, context, errors }, testInfo) => {
    await context.addCookies([{ name: "NEXT_LOCALE", value: locale, url: testInfo.project.use.baseURL ?? "http://localhost:3100" }]);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.waitForLoadState("networkidle");
    await screenshot(page, `home-${locale}`, testInfo.project.name);
    expect(errors).toEqual([]);
  });
}
