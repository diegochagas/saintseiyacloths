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

type TableResultsProps = Pick<
  TableProps,
  "data" | "currentPage" | "totalPages" | "handlePageChange" | "leftDescription" | "rightDescription"
>;

// Result counters ("120 results 1 - 20" / "saints 80 of 88 revealed") above the list.
function TableDescriptions({ leftDescription, rightDescription }: TableResultsProps) {
  return (
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
  );
}

function TableResults(props: TableResultsProps) {
  const { data, currentPage, totalPages, handlePageChange } = props;

  return (
    <div className="flex flex-col justify-center relative">
      <AdBanner dataAdSlot="4211636385" className="mt-5 mb-10" />

      <div className="bg-white p-5">
        <div className="border-2 border-black p-5 max-w-7xl mb-5">
          <TableDescriptions {...props} />
          <Saints data={data} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default function Table(props: TableProps) {
  const { title, tabsTitle, tabs, activeTab, subTabs, subTabId, data, handleTabChange, errorMessage } = props;

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

      {data?.length > 0 ? <TableResults {...props} /> : <Error title={title}>{errorMessage}</Error>}

      <AdBanner dataAdSlot="8270037567" className="mt-10" />
    </div>
  );
}
