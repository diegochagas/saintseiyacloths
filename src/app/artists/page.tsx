"use client";

import { useCallback, useEffect, useState } from "react";
import Table from "../components/table";
import { useLoading } from "../context/loading-content";
import { TabProps } from "../components/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import official from "../../pages/api/data/official.json";
import { useTranslations } from "next-intl";

export default function Artists() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subTabs, setSubTabs] = useState<TabProps[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    searchParams?.get("q") || "1"
  );
  const initialPage = parseInt(searchParams?.get("p") || "1");
  const [currentPage, setCurrentPage] = useState<number>(
    initialPage >= 1 ? initialPage : 1
  );
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [leftDescription, setLeftDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setIsLoading, setLoadingBg } = useLoading();

  useEffect(() => {
    async function getTabs() {
      try {
        const response = await fetch("/api/artists?q=filtered");
        const items = await response.json();

        if (items && items.length > 0) setSubTabs(items);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    getTabs();
  }, [setIsLoading, t]);

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(`artists?q=${activeTab}&p=${page}`);
      setCurrentPage(page);
    },
    [activeTab, router]
  );

  const loadData = useCallback(async () => {
    const pageParam = currentPage ? `?p=${currentPage}` : "";
    const midiaParam = activeTab ? `&q=${activeTab}` : "";
    const response = await fetch(`/api/artists${pageParam}${midiaParam}`);
    const result = await response.json();
    if (!result.data?.length) handlePageChange(1);
    setData(result.data);
    setTotalPages(result.totalPages);
    setLeftDescription(
      `${result.totalResults} ${t("results")} ${result.resultInitial} - ${
        result.resultLast
      }`
    );
    router.push(`artists${pageParam}${midiaParam}`);
  }, [activeTab, currentPage, handlePageChange, router, t]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBg("bg-white/75");
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
  }, [loadData, setIsLoading, setLoadingBg, t]);

  const handleTabChange = (tab: string) => {
    setCurrentPage(1);
    setActiveTab(tab);
  };

  return (
    <Table
      title={t("artists")}
      tabsTitle={t("artist")}
      tabs={official}
      subTabs={subTabs}
      subTabId="official"
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      data={data}
      errorMessage={errorMessage}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
      leftDescription={leftDescription}
    />
  );
}
