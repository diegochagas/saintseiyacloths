import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export type SetErrorMessage = Dispatch<SetStateAction<string>>;

// Shape of the paged API responses (/api/classes, /api/history, /api/artists).
export interface PagedResult {
  data: any[];
  totalPages: number;
  totalResults: number;
  resultInitial: number;
  resultLast: number;
}

/**
 * "120 results 1 - 20": the counter shown above every paged list.
 *
 * @example pagedResultsDescription({ totalResults: 3, resultInitial: 1, resultLast: 3 }, t)
 */
export function pagedResultsDescription(
  result: Pick<PagedResult, "totalResults" | "resultInitial" | "resultLast">,
  t: (key: string) => string,
): string {
  return `${result.totalResults} ${t("results")} ${result.resultInitial} - ${result.resultLast}`;
}

/**
 * Active tab and page of a paged list, mirrored in the URL as `<route>?q=<tab>&p=<page>`.
 * Changing the tab always goes back to page 1.
 *
 * @example const { activeTab, currentPage, handlePageChange, handleTabChange } = usePagedRoute("classes", "saints");
 */
export function usePagedRoute(route: string, defaultTab: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get("q") || defaultTab);
  const initialPage = parseInt(searchParams?.get("p") || "1");
  const [currentPage, setCurrentPage] = useState<number>(initialPage >= 1 ? initialPage : 1);

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(`${route}?q=${activeTab}&p=${page}`);
      setCurrentPage(page);
    },
    [activeTab, route, router],
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`${route}?q=${tab}&p=${1}`);
    setCurrentPage(1);
  };

  return { activeTab, currentPage, handlePageChange, handleTabChange };
}
