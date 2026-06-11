import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import saintsJson from "@/pages/api/data/saints.json";
import { loadSaintData, SaintProps } from "@/pages/api/classes";
import { getHistory, getName } from "@/helpers";
import Details from "./details";

const baseUrl = "https://www.saintseiyacloths.com";

function getSaint(id: string): SaintProps | undefined {
  const saint = saintsJson.find((s) => s.id === id);

  if (!saint) return undefined;

  const others = saintsJson
    .filter((s) => s.character && s.character === saint.character)
    .map((s) => loadSaintData(s));

  return { ...loadSaintData(saint), others } as unknown as SaintProps;
}

export function generateStaticParams() {
  return saintsJson.map((saint) => ({ id: saint.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const saint = getSaint(id);

  if (!saint) return { title: "Saint not found" };

  const t = await getTranslations();
  const locale = await getLocale();

  const name = getName(
    saint.name || "",
    saint.cloth?.name && saint.cloth.name !== "basic" ? saint.cloth.name : "",
    locale,
    saint.group?.class ? t(saint.group.class, { count: 1 }) : "",
    saint.version ? t(saint.version) : "",
    saint.rank ? t(saint.rank) : ""
  ).trim();

  const description = `${name} — ${t("saintClothScheme")}: ${getHistory(
    t,
    saint.history
  )}`;

  return {
    title: name,
    description,
    alternates: { canonical: `${baseUrl}/classes/${id}` },
    openGraph: {
      title: name,
      description,
      url: `${baseUrl}/classes/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const saint = getSaint(id);

  if (!saint) notFound();

  return <Details saint={saint} url={`${baseUrl}/classes/${id}`} />;
}
