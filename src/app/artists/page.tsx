"use client";

import { useCallback, useEffect, useState } from "react";
import Table from "../components/table";
import { useLoading } from "../context/loading-content";
import { TabProps } from "../components/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import officialTabs from "../../pages/api/data/official.json";
import { useTranslations } from "next-intl";

export default function Artists() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoading, setLoadingBg } = useLoading();

  const initialTab = searchParams?.get("q") || "1";
  const initialPage = Math.max(parseInt(searchParams?.get("p") || "1", 10), 1);

  const [subTabs, setSubTabs] = useState<TabProps[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [leftDescription, setLeftDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchSubTabs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/artists?q=filtered");
      const items = await response.json();

      if (Array.isArray(items) && items.length > 0) setSubTabs(items);
    } catch (error) {
      setErrorMessage(`${t("errorFetchingData")} ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchArtists = useCallback(async () => {
    setLoadingBg("bg-white/75");
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        p: currentPage.toString(),
        q: activeTab,
      }).toString();
      const response = await fetch(`/api/artists?${queryParams}`);
      const result = await response.json();

      if (result.data?.length) {
        setData(result.data);
        setTotalPages(result.totalPages);
        setLeftDescription(
          `${result.totalResults} ${t("results")} ${result.resultInitial} - ${
            result.resultLast
          }`
        );
      }
    } catch (error) {
      setErrorMessage(`${t("errorFetchingData")} ${error}`);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(`artists?q=${activeTab}&p=${page}`);
      setCurrentPage(page);
    },
    [activeTab, router]
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    router.push(`artists?q=${tab}&p=${1}`);
  };

  return (
    <Table
      title={t("artists")}
      tabsTitle={t("artist")}
      tabs={officialTabs}
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
