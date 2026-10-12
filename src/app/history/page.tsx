"use client";

import { useState } from "react";
import Table from "../components/table";
import { useTranslations } from "next-intl";
import { usePagedRoute } from "../hooks/use-paged-route";
import { useHistoryResults, useHistoryTabs } from "./use-history-table";

export default function History() {
  const t = useTranslations();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { activeTab, currentPage, handlePageChange, handleTabChange } = usePagedRoute("history", "1");
  const { tabs, subTabs } = useHistoryTabs(setErrorMessage);
  const results = useHistoryResults(activeTab, currentPage, handlePageChange, setErrorMessage);

  return (
    <Table
      title={t("history")}
      tabsTitle={t("history")}
      tabs={tabs}
      subTabs={subTabs}
      subTabId="midia"
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      data={results.items}
      errorMessage={errorMessage}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={results.totalPages}
      leftDescription={results.leftDescription}
    />
  );
}
