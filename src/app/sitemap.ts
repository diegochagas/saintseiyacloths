import type { MetadataRoute } from "next";
import saintsJson from "@/pages/api/data/saints.json";
import classesJson from "@/pages/api/data/classes.json";
import { SITE_URL } from "@/site";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/classes",
    "/teogonia",
    "/artists",
    "/history",
    "/about",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const classPages: MetadataRoute.Sitemap = classesJson.map((cls) => ({
    url: `${baseUrl}/classes?q=${cls.id}&p=1`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const saintPages: MetadataRoute.Sitemap = saintsJson.map((saint) => ({
    url: `${baseUrl}/classes/${saint.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...classPages, ...saintPages];
}
