import { NewsProps } from "@/pages/api/news";
import Pagination from "../components/pagination";
import NewsList from "../components/news-list";
import Tabs, { TabProps } from "../components/tabs";
import Icon from "../components/icons";
import { useTranslations } from "next-intl";
import AdBanner from "../components/adbanner";

interface ContentProps {
  news: NewsProps[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  tabs: TabProps[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchValue: string;
  onSearchValue: (text: string) => void;
  onSearchClear: () => void;
  errorMessage?: string;
}

export default function Content({
  news,
  currentPage,
  totalPages,
  onPageChange,
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchValue,
  onSearchClear,
  errorMessage,
}: ContentProps) {
  const t = useTranslations();

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">
          {t("news")}
        </h1>
      </div>

      {tabs?.length > 0 && (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          title={t("midia")}
        />
      )}

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full items-center">
        <section className="max-w-7xl my-20 bg-white w-full">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="1204536968"
          />
        </section>

        <div className="flex items-center w-full max-w-7xl gap-4 p-5">
          <form className="w-full max-w-md h-10 flex items-center bg-zinc-300">
            <input
              className="border-2 bg-zinc-300 border-none w-full h-full p-3 text-xs focus:outline-none font-bold"
              type="text"
              placeholder={t("search")}
              value={searchValue}
              onChange={(event) => onSearchValue(event.target.value)}
            />

            <Icon className="mx-2" name="search" size={28} color="#373737" />
          </form>

          <button
            className="bg-white hover:bg-black disabled:hover:bg-white hover:text-white disabled:hover:text-black w-20 h-10 px-3 text-xs font-bold"
            onClick={onSearchClear}
            disabled={searchValue === ""}
          >
            {t("clear")}
          </button>
        </div>

        <NewsList news={news} />

        <div className="mb-20 w-full max-w-7xl">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        <section className="max-w-7xl mb-20 bg-white w-full">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="2990054059"
          />
        </section>
      </div>
    </div>
  );
}
