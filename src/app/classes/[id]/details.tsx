"use client";

import { useEffect } from "react";
import { useLoading } from "@/app/context/loading-content";
import { SaintProps } from "@/pages/api/classes";
import Content from "./content";

interface DetailsProps {
  saint: SaintProps;
  url: string;
}

export default function Details({ saint, url }: DetailsProps) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return <Content saint={saint} error={undefined} url={url} />;
}
