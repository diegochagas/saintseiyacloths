import { useTranslations } from "next-intl";
import React, { ChangeEvent } from "react";

export interface TabProps {
  id: string;
  name: string;
}

export interface ItemProps extends TabProps {
  options?: TabProps[];
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
  const items: ItemProps[] = tabs.map((tab) => ({
    ...tab,
    options: subTabs?.filter((option) => option[`${subTabId}`]?.id === tab.id),
  }));

  function tabClassName(isSelected: boolean) {
    return `${
      isSelected ? "bg-black text-white" : "bg-white text-black"
    } hover:bg-black hover:text-white border-2 md:border-4 border-black px-1 md:px-8 rounded-3xl font-black text-xs md:text-sm capitalize`;
  }

  function handleTabChange(tabId: string) {
    if (tabId) {
      if (isAlwaysActive) {
        onTabChange(tabId);
      } else {
        if (tabId === activeTab) {
          onTabChange("");
        } else {
          onTabChange(tabId);
        }
      }
    }
  }

  const renderButton = (item: any) => (
    <button
      className={tabClassName(activeTab === item.id)}
      onClick={() => handleTabChange(item.id)}
      disabled={isAlwaysActive && activeTab === item.id}
    >
      {item.midia?.name ? `${t(item.midia?.name)}: ` : ""}
      {t(item.name)}
    </button>
  );

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
              {item.options?.length && item.options?.length > 0 ? (
                item.options.length > 1 ? (
                  <select
                    className={`text-center ${tabClassName(
                      item.options.some((option) => option.id === activeTab)
                    )}`}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      handleTabChange(event.target.value)
                    }
                    value={
                      item.options.find((option) => option.id === activeTab)
                        ? activeTab
                        : ""
                    }
                  >
                    <option value="">{t(item.name)}</option>
                    {item.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {subTabId === "midia" ? t(item.name) : ""}
                        {option.name && subTabId === "midia"
                          ? `: ${t(option.name)}`
                          : option.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  renderButton(item.options[0])
                )
              ) : (
                renderButton(item)
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
