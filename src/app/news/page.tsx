"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "../context/loading-content";
import Content from "./content";
import { TabProps } from "../components/tabs";
import { useTranslations } from "next-intl";

export default function News() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams?.get("m") || "");
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams?.get("p") || 1)
  );
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>(
    searchParams?.get("s") || ""
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setIsLoading } = useLoading();

  useEffect(() => {
    async function getTabs() {
      try {
        const midiasResponse = await fetch("/api/midias");
        const midias = await midiasResponse.json();
        setTabs(midias);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    getTabs();
  }, [setIsLoading, t]);

  const loadData = useCallback(async () => {
    const pageParam = currentPage ? `?p=${currentPage}` : "";
    const searchParam = searchValue ? `&s=${searchValue}` : "";
    const midiaParam = activeTab ? `&m=${activeTab}` : "";
    const response = await fetch(
      `/api/news${pageParam}${midiaParam}${searchParam}`
    );
    const result = await response.json();
    setData(result.data);
    setTotalPages(result.totalPages);
    router.push(`news${pageParam}${midiaParam}${searchParam}`);
  }, [activeTab, currentPage, router, searchValue]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        loadData();
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loadData, setIsLoading, t]);

  const handleTabChange = (tab: string) => {
    setCurrentPage(1);
    router.push(`news?p=${1}&m=${tab}`);
    setActiveTab(tab);
  };

  return (
    <Content
      news={data}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      searchValue={searchValue}
      onSearchValue={setSearchValue}
      onSearchClear={() => setSearchValue("")}
      errorMessage={errorMessage}
    />
  );
}
