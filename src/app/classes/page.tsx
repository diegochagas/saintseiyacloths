"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Table from "../components/table";
import { useCallback, useEffect, useState } from "react";
import { TabProps } from "../components/tabs";
import { useLoading } from "../context/loading-content";
import { useTranslations } from "next-intl";

export default function Classes() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    searchParams?.get("q") || "saints"
  );
  const initialPage = parseInt(searchParams?.get("p") || "1");
  const [currentPage, setCurrentPage] = useState<number>(
    initialPage >= 1 ? initialPage : 1
  );
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [leftDescription, setLeftDescription] = useState("");
  const [rightDescription, setRightDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setIsLoading, setLoadingBg } = useLoading();

  useEffect(() => {
    async function getTabs() {
      try {
        const response = await fetch(`/api/classes`);
        const items = await response.json();
        setTabs(items);
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
      router.push(`classes?q=${activeTab}&p=${page}`);
      setCurrentPage(page);
    },
    [activeTab, router]
  );

  const loadData = useCallback(async () => {
    const response = await fetch(
      `/api/classes/?q=${activeTab}&p=${currentPage}`
    );
    const result = await response.json();
    if (!result.data?.length) handlePageChange(1);
    setData(result.data);
    setTotalPages(result.totalPages);
    setLeftDescription(
      `${result.totalResults} ${t("results")} ${result.resultInitial} - ${
        result.resultLast
      }`
    );
    if (activeTab === "saints" || activeTab === "specters")
      setRightDescription(
        `${activeTab} ${result.totalRevealed} ${t("of")} ${
          result.totalSaints
        } ${t("revealed")}`
      );
    else setRightDescription("");
  }, [activeTab, currentPage, handlePageChange, t]);

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
    setActiveTab(tab);
    router.push(`classes?q=${tab}&p=${1}`);
    setCurrentPage(1);
  };

  return (
    <Table
      title={t("classes")}
      tabsTitle={t("class")}
      tabs={tabs}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      data={data}
      errorMessage={errorMessage}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
      leftDescription={leftDescription}
      rightDescription={rightDescription}
    />
  );
}
