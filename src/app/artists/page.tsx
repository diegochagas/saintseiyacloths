"use client";

import { useState } from "react";
import Table from "../components/table";
import officialTabs from "../../pages/api/data/official.json";
import { useTranslations } from "next-intl";
import { usePagedRoute } from "../hooks/use-paged-route";
import { useArtistResults, useArtistSubTabs } from "./use-artists-table";

export default function Artists() {
  const t = useTranslations();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { activeTab, currentPage, handlePageChange, handleTabChange } = usePagedRoute("artists", "1");
  const subTabs = useArtistSubTabs(setErrorMessage);
  const results = useArtistResults(activeTab, currentPage, setErrorMessage);

  return (
    <Table
      title={t("artists")}
      tabsTitle={t("artist")}
      tabs={officialTabs}
      subTabs={subTabs}
      subTabId="official"
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
