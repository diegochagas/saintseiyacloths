/**
 * Every absolute URL the site publishes (sitemap, robots, metadata) uses the
 * canonical origin. A dead domain here breaks search indexing and link previews.
 */
import fs from "node:fs";
import path from "node:path";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/site";

describe("canonical URL", () => {
  it("is the live https origin without a trailing slash", () => {
    expect(SITE_URL).toBe("https://saintseiyacloths.diegochagas.com");
  });

  it("sitemap only lists canonical URLs", () => {
    const offsite = sitemap().filter((entry) => !entry.url.startsWith(`${SITE_URL}/`) && entry.url !== SITE_URL);
    expect(offsite).toEqual([]);
  });

  it("robots points to the canonical sitemap", () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("no source file hardcodes another origin for the site", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
          if (/https?:\/\/(www\.)?saintseiyacloths\.com/.test(fs.readFileSync(full, "utf8"))) hits.push(full);
        }
      }
    };
    walk(path.join(process.cwd(), "src"));
    expect(hits).toEqual([]);
  });
});
