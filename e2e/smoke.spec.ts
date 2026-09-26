import AxeBuilder from "@axe-core/playwright";
import { test, expect, screenshot } from "./fixtures";

const routes = [
  { name: "home", path: "/" },
  { name: "classes", path: "/classes" },
  { name: "class-saints", path: "/classes?q=saints&p=1" },
  { name: "saint", path: "/classes/1" },
  { name: "teogonia", path: "/teogonia" },
  { name: "artists", path: "/artists" },
  { name: "history", path: "/history" },
  { name: "about", path: "/about" },
];

for (const route of routes) {
  test(`${route.name} renders without errors`, async ({ page, errors }, testInfo) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer").first()).toBeVisible();
    await expect(page.getByText(/saint not found|something went wrong/i)).toHaveCount(0);

    await screenshot(page, route.name, testInfo.project.name);
    expect(errors).toEqual([]);
  });
}

test("unknown route shows the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("/classes/1</loc>");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toMatch(/sitemap:/i);
});

test("home has title, description and Open Graph tags", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Saint Seiya Cloths/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /cloth/i);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
});

test("home has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations
    .filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
    .map((violation) => `${violation.id} (${violation.nodes.length})`);
  expect(serious).toEqual([]);
});
