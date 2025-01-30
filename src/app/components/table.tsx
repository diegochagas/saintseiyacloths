import Pagination from "./pagination";
import Saints from "@/app/components/saints";
import Tabs, { TabProps } from "./tabs";
import Error from "./error";
import AdBanner from "./adbanner";

interface TableProps {
  title: string;
  tabsTitle: string;
  tabs: TabProps[];
  activeTab: string;
  data: any[];
  currentPage: number;
  totalPages: number;
  handleTabChange: (tab: string) => void;
  handlePageChange: (page: number) => void;
  errorMessage: string;
  subTabs?: TabProps[];
  subTabId?: string;
  leftDescription?: string;
  rightDescription?: string;
}

export default function Table({
  title,
  tabsTitle,
  tabs,
  activeTab,
  subTabs,
  subTabId,
  data,
  currentPage,
  totalPages,
  handleTabChange,
  handlePageChange,
  errorMessage,
  leftDescription,
  rightDescription,
}: TableProps) {
  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">
          {title}
        </h1>
      </div>

      {tabs?.length > 0 && (
        <Tabs
          tabs={tabs}
          subTabs={subTabs}
          activeTab={activeTab}
          subTabId={subTabId}
          onTabChange={handleTabChange}
          title={tabsTitle}
          isAlwaysActive
        />
      )}

      {data?.length > 0 ? (
        <div className="flex flex-col justify-center relative">
          <section className="max-w-7xl mt-5 mb-10 bg-white w-full">
            <AdBanner
              dataAdFormat="auto"
              dataFullWidthResponsive={true}
              dataAdSlot="4211636385"
            />
          </section>

          <div className="bg-white p-5">
            <div className="border-2 border-black p-5 max-w-7xl mb-5">
              <p className="flex justify-between">
                {leftDescription && (
                  <small className="mb-2 md:my-4 block text-2xs sm:text-xs">
                    {leftDescription}
                  </small>
                )}
                {rightDescription && (
                  <small className="mb-2 md:my-4 block capitalize text-2xs sm:text-xs">
                    {rightDescription}
                  </small>
                )}
              </p>
              <Saints data={data} />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <Error title={title}>{errorMessage}</Error>
      )}

      <section className="max-w-7xl mt-10 bg-white w-full">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="8270037567"
        />
      </section>
    </div>
  );
}
