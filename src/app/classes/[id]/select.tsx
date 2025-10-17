"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SaintProps } from "@/pages/api/classes";
import { getHistory } from "@/helpers";

interface SelectProps {
  options: SaintProps[];
  defaultOption: string;
}

export default function Select({ options, defaultOption }: SelectProps) {
  const route = useRouter();
  const t = useTranslations();

  return (
    <select
      className="text-center bg-white text-black hover:bg-black hover:text-white border-4 border-black px-8 rounded-3xl font-black text-sm capitalize cursor-pointer"
      defaultValue={defaultOption}
      onChange={(e) => route.push(`/classes/${e.target.value}`)}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {getHistory(t, option.history)}
        </option>
      ))}
    </select>
  );
}
