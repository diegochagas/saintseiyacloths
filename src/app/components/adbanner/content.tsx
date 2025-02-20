"use client";

import { useEffect } from "react";

interface AdBannerContentTypes {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
}

export default function AdBannerContent({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerContentTypes) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-7593159682938893"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
      data-testid="ad-banner"
    ></ins>
  );
}
