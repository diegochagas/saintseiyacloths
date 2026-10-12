import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TabProps } from "../components/tabs";
import { useLoading } from "../context/loading-content";
import { pagedResultsDescription, PagedResult, SetErrorMessage } from "../hooks/use-paged-route";

// Tabs are the media (manga, anime...); sub tabs the stories of each one.
export function useHistoryTabs(setErrorMessage: SetErrorMessage) {
  const t = useTranslations();
  const { setIsLoading } = useLoading();
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [subTabs, setSubTabs] = useState<TabProps[]>([]);

  useEffect(() => {
    async function getTabs() {
      try {
        const midiasResponse = await fetch("/api/midias");
        const midias = await midiasResponse.json();
        setTabs(midias);
        const response = await fetch(`/api/history`);
        const items = await response.json();
        setSubTabs(items);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    getTabs();
  }, [setErrorMessage, setIsLoading, t]);

  return { tabs, subTabs };
}

export function useHistoryResults(
  activeTab: string,
  currentPage: number,
  handlePageChange: (page: number) => void,
  setErrorMessage: SetErrorMessage,
) {
  const t = useTranslations();
  const { setIsLoading, setLoadingBg } = useLoading();
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [leftDescription, setLeftDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBg("bg-white/75");
      setIsLoading(true);
      try {
        const response = await fetch(`/api/history/?q=${activeTab}&p=${currentPage}`);
        const result: PagedResult = await response.json();
        if (!result.data?.length) handlePageChange(1);
        setItems(result.data);
        setTotalPages(result.totalPages);
        setLeftDescription(pagedResultsDescription(result, t));
        setIsLoading(false);
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, handlePageChange, setErrorMessage, setIsLoading, setLoadingBg, t]);

  return { items, totalPages, leftDescription };
}
