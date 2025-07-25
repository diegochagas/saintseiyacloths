"use client";

import { useEffect, useState } from "react";
import { SaintProps } from "@/pages/api/classes";
import Banner from "./components/banner";
import Store from "./components/store";
import Classes from "./components/classes";
import { useLoading } from "../context/loading-content";
import { useTranslations } from "next-intl";
import AdBanner from "../components/adbanner";

export default function Home() {
  const t = useTranslations();
  const { setIsLoading } = useLoading();
  const [saints, setSaints] = useState<SaintProps[]>([]);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    setLanguage(
      navigator.language ||
        navigator.languages.find((language) => language.includes("pt")) ||
        ""
    );
  }, []);

  useEffect(() => {
    async function getSaints() {
      try {
        const response = await fetch("/api/classes?q=latest");
        const result = await response.json();
        setSaints(result.data);
        return response;
      } catch (err) {
        return { status: 500, message: `${t("saintNotFound")} ${err}` };
      }
    }

    async function checkIfIsLoading() {
      const responseSaints = await getSaints();

      if (!!responseSaints.status) {
        setIsLoading(false);
      }
    }

    checkIfIsLoading();
  }, [setIsLoading, t]);

  return (
    <>
      <Banner />

      <Store isBrazil={language.includes("pt")} />

      {saints && <Classes saints={saints.slice(-8)} />}

      <AdBanner dataAdSlot="1132384777" className="mb-20" />
    </>
  );
}
