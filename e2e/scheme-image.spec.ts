import { test, expect } from "./fixtures";

// Web copies are 400px tall, so on a 2x screen next/image's 2x candidate is the
// original file and the browser laid it out at half size (~200px). The scheme
// must always show 400px tall, shrinking only when the screen is too narrow.
test.use({ deviceScaleFactor: 2 });

const saints = ["/classes/1", "/classes/136"];

for (const path of saints) {
  test(`cloth scheme on ${path} is 400px tall`, async ({ page }, testInfo) => {
    await page.goto(path);
    const image = page.getByRole("img", { name: /cloth scheme/i }).first();
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeTruthy();

    const { width, height } = await image.evaluate((img: HTMLImageElement) => ({
      width: img.clientWidth,
      height: img.clientHeight,
    }));
    if (testInfo.project.name === "mobile") {
      expect(width).toBeLessThanOrEqual(page.viewportSize()!.width);
      expect(height).toBeLessThanOrEqual(400);
      expect(height).toBeGreaterThan(150);
    } else {
      expect(height).toBe(400);
    }
  });
}
