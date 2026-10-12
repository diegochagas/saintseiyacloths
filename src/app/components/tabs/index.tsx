import { useTranslations } from "next-intl";
import React, { ChangeEvent } from "react";

export interface TabProps {
  id: string;
  name: string;
}

export interface ItemProps extends TabProps {
  options?: TabProps[];
}

// A sub tab may carry its media (history entries do), shown as "Anime: Sanctuary".
interface TabOption extends TabProps {
  midia?: { name: string };
}

interface TabsProps {
  tabs: TabProps[];
  subTabs?: any[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  subTabId?: string;
  title?: string;
  isAlwaysActive?: boolean;
}

interface TabItemProps {
  item: ItemProps;
  activeTab: string;
  subTabId?: string;
  isAlwaysActive?: boolean;
  onSelect: (tabId: string) => void;
}

function tabClassName(isSelected: boolean) {
  return `${
    isSelected ? "bg-black text-white" : "bg-white text-black cursor-pointer"
  } hover:bg-black hover:text-white border-2 md:border-4 border-black px-1 md:px-8 rounded-3xl font-black text-xs md:text-sm capitalize`;
}

function TabButton({ item, activeTab, isAlwaysActive, onSelect }: TabItemProps) {
  const t = useTranslations();
  const option = item as TabOption;

  return (
    <button
      className={tabClassName(activeTab === item.id)}
      onClick={() => onSelect(item.id)}
      disabled={isAlwaysActive && activeTab === item.id}
    >
      {option.midia?.name ? `${t(option.midia?.name)}: ` : ""}
      {t(item.name, { count: 2 })}
    </button>
  );
}

function TabSelect({ item, activeTab, subTabId, onSelect }: TabItemProps) {
  const t = useTranslations();
  const options = item.options ?? [];
  const isSelected = options.some((option) => option.id === activeTab);

  return (
    <select
      className={`text-center ${tabClassName(isSelected)}`}
      onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelect(event.target.value)}
      value={isSelected ? activeTab : ""}
    >
      <option value="">{t(item.name)}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {subTabId === "midia" ? t(item.name) : ""}
          {option.name && subTabId === "midia" ? `: ${t(option.name)}` : option.name}
        </option>
      ))}
    </select>
  );
}

// Several sub tabs become a <select>; a single one replaces the tab's own button.
function TabItem(props: TabItemProps) {
  const options = props.item.options ?? [];
  if (options.length > 1) return <TabSelect {...props} />;
  if (options.length === 1) return <TabButton {...props} item={options[0]} />;
  return <TabButton {...props} />;
}

// Attach to each tab the sub tabs that point at it through `subTabId`
// (history entries -> their media, artists -> their official site).
function withSubTabOptions(tabs: TabProps[], subTabs?: any[], subTabId?: string): ItemProps[] {
  return tabs.map((tab) => ({
    ...tab,
    options: subTabs?.filter((option) => option[`${subTabId}`]?.id === tab.id),
  }));
}

export default function Tabs({
  tabs,
  subTabs,
  activeTab,
  onTabChange,
  subTabId,
  title,
  isAlwaysActive,
}: TabsProps) {
  const t = useTranslations();
  const items = withSubTabOptions(tabs, subTabs, subTabId);

  function handleTabChange(tabId: string) {
    if (!tabId) return;
    // Clicking the active tab clears the selection unless one tab must stay active.
    onTabChange(isAlwaysActive || tabId !== activeTab ? tabId : "");
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {title && (
        <h2 className="uppercase text-white bg-black text-2xl sm:text-4xl md:text-5xl font-black w-fit px-1 md:py-2 relative top-4 md:top-6">
          {t("select")} {title}
        </h2>
      )}
      <div className="bg-neutral-400 pt-2 md:pt-10 md:pb-5 w-full flex justify-center">
        <ul className="flex flex-wrap justify-center items-center gap-1 m-5 max-w-7xl">
          {items.map((item) => (
            <li key={item.id}>
              <TabItem
                item={item}
                activeTab={activeTab}
                subTabId={subTabId}
                isAlwaysActive={isAlwaysActive}
                onSelect={handleTabChange}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
