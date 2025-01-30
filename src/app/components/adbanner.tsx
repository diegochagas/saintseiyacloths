"use client";

import { useEffect } from "react";

interface AdBannerTypes {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerTypes) {
  useEffect(() => {
    try {
      if ((window as any).adsbygoogle && !(window as any).adsbygoogle.loaded)
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
    ></ins>
  );
}
