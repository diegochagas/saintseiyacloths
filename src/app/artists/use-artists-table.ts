import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TabProps } from "../components/tabs";
import { useLoading } from "../context/loading-content";
import { pagedResultsDescription, PagedResult, SetErrorMessage } from "../hooks/use-paged-route";

// Sub tabs are the artists that have at least one scheme, grouped under their official site.
export function useArtistSubTabs(setErrorMessage: SetErrorMessage): TabProps[] {
  const t = useTranslations();
  const { setIsLoading } = useLoading();
  const [subTabs, setSubTabs] = useState<TabProps[]>([]);

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

  return subTabs;
}

export function useArtistResults(activeTab: string, currentPage: number, setErrorMessage: SetErrorMessage) {
  const t = useTranslations();
  const { setIsLoading, setLoadingBg } = useLoading();
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [leftDescription, setLeftDescription] = useState<string>("");

  const fetchArtists = useCallback(async () => {
    setLoadingBg("bg-white/75");
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        p: currentPage.toString(),
        q: activeTab,
      }).toString();
      const response = await fetch(`/api/artists?${queryParams}`);
      const result: PagedResult = await response.json();

      if (result.data?.length) {
        setItems(result.data);
        setTotalPages(result.totalPages);
        setLeftDescription(pagedResultsDescription(result, t));
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

  return { items, totalPages, leftDescription };
}
