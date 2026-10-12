"use client";

import { useState } from "react";
import Table from "../components/table";
import { useTranslations } from "next-intl";
import { usePagedRoute } from "../hooks/use-paged-route";
import { useClassResults, useClassTabs } from "./use-classes-table";

export default function Classes() {
  const t = useTranslations();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { activeTab, currentPage, handlePageChange, handleTabChange } = usePagedRoute("classes", "saints");
  const tabs = useClassTabs(setErrorMessage);
  const results = useClassResults(activeTab, currentPage, handlePageChange, setErrorMessage);

  return (
    <Table
      title={t("classes")}
      tabsTitle={t("class")}
      tabs={tabs}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      data={results.items}
      errorMessage={errorMessage}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={results.totalPages}
      leftDescription={results.leftDescription}
      rightDescription={results.rightDescription}
    />
  );
}
