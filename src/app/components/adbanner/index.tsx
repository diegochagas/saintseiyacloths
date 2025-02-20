import AdBannerContent from "./content";

interface AdBannerProps {
  dataAdSlot: string;
  className?: string;
}

export default function AdBanner({
  dataAdSlot,
  className = "",
}: AdBannerProps) {
  return (
    <section className={`max-w-7xl bg-white w-full ${className}`}>
      {process.env.NODE_ENV === "production" ? (
        <AdBannerContent
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot={dataAdSlot}
        />
      ) : (
        <div className={`h-44 ${className}`} data-testid="ad-banner" />
      )}
    </section>
  );
}
