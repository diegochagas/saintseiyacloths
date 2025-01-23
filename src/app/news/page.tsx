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
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setIsLoading } = useLoading();

  const handlePageParam = (page?: string) =>
    setCurrentPage(page ? `?p=${page}` : "");

  const handleSearchParam = (search?: string) =>
    setSearchValue(search ? `&s=${search}` : "");

  const handleMidiaParam = (midia?: string) =>
    setActiveTab(midia ? `&m=${midia}` : "");

  useEffect(() => {
    const midia = searchParams?.get("m");
    const page = searchParams?.get("p");
    const search = searchParams?.get("s");

    if (midia) handleMidiaParam(midia);
    if (page) handlePageParam(page);
    if (search) handleSearchParam(search);
  }, [searchParams]);

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

  useEffect(() => {
    router.push(`news${currentPage}${searchValue}${activeTab}`);
  }, [activeTab, currentPage, router, searchValue]);

  const loadData = useCallback(async () => {
    const response = await fetch(
      `/api/news${currentPage}${activeTab}${searchValue}`
    );
    const result = await response.json();
    if (!result.data?.length) handlePageParam("1");
    setData(result.data);
    setTotalPages(result.totalPages);
    setIsLoading(false);
    setIsLoading(false);
  }, [activeTab, currentPage, searchValue, setIsLoading]);

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

  return (
    <Content
      news={data}
      currentPage={Number(currentPage?.match(/\d+/g)?.[0] || 1)}
      totalPages={totalPages}
      onPageChange={(page) => handlePageParam(String(page))}
      tabs={tabs}
      activeTab={activeTab?.match(/&m=([^&]*)/)?.[1] || ""}
      onTabChange={(tab) => handleMidiaParam(tab)}
      searchValue={searchValue?.match(/&s=([^&]*)/)?.[1] || ""}
      onSearchValue={(value) => handleSearchParam(value)}
      onSearchSubmit={loadData}
      onSearchClear={handleSearchParam}
      errorMessage={errorMessage}
    />
  );
}
