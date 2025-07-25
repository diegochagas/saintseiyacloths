"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/app/context/loading-content";
import Content from "./content";
import { SaintProps } from "@/pages/api/classes";

export default function Details() {
  const pathname = usePathname();
  const id = pathname?.split("/")?.pop();
  const { setIsLoading } = useLoading();
  const [data, setData] = useState<SaintProps>();
  const [errorMessage, setErrorMessage] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/classes/${id}`);
        const newData = await response.json();
        setData(newData);
        setIsLoading(false);
      } catch (err) {
        setErrorMessage(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setIsLoading]);

  return data ? (
    <Content saint={data} error={errorMessage} url={window.location.href} />
  ) : null;
}
