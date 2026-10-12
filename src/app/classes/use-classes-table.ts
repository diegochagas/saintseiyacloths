import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TabProps } from "../components/tabs";
import { useLoading } from "../context/loading-content";
import { pagedResultsDescription, PagedResult, SetErrorMessage } from "../hooks/use-paged-route";

interface ClassesResult extends PagedResult {
  totalRevealed: number;
  totalSaints: number;
}

export function useClassTabs(setErrorMessage: SetErrorMessage): TabProps[] {
  const t = useTranslations();
  const { setIsLoading } = useLoading();
  const [tabs, setTabs] = useState<TabProps[]>([]);

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
  }, [setErrorMessage, setIsLoading, t]);

  return tabs;
}

// "saints 80 of 88 revealed": only the two classes whose full roster is known.
function revealedDescription(activeTab: string, result: ClassesResult, t: (key: string) => string) {
  if (activeTab !== "saints" && activeTab !== "specters") return "";
  return `${activeTab} ${result.totalRevealed} ${t("of")} ${result.totalSaints} ${t("revealed")}`;
}

export function useClassResults(
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
  const [rightDescription, setRightDescription] = useState("");

  const loadData = useCallback(async () => {
    const response = await fetch(`/api/classes/?q=${activeTab}&p=${currentPage}`);
    const result: ClassesResult = await response.json();
    if (!result.data?.length) handlePageChange(1);
    setItems(result.data);
    setTotalPages(result.totalPages);
    setLeftDescription(pagedResultsDescription(result, t));
    setRightDescription(revealedDescription(activeTab, result, t));
  }, [activeTab, currentPage, handlePageChange, t]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBg("bg-white/75");
      setIsLoading(true);
      try {
        await loadData();
      } catch (error) {
        setErrorMessage(`${t("errorFetchingData")} ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loadData, setErrorMessage, setIsLoading, setLoadingBg, t]);

  return { items, totalPages, leftDescription, rightDescription };
}
