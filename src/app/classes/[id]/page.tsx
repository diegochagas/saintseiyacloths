import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import saintsJson from "@/pages/api/data/saints.json";
import { loadSaintData, SaintProps } from "@/pages/api/classes";
import { getHistory, getSaintRecordName } from "@/helpers";
import Details from "./details";
import { SITE_URL } from "@/site";

const baseUrl = SITE_URL;

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

  const name = getSaintRecordName(saint, locale, t).trim();

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
