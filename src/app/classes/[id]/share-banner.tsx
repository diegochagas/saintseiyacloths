import Image from "next/image";
import { useTranslations } from "next-intl";
import Icon from "@/app/components/icons";
import { SaintProps } from "@/pages/api/classes";

const SHARE_HASHTAGS =
  "%23saintseiya %23clothmyth %23actionfigures %23cavaleirosdozodiaco %23caballerosdelzodiaco %23leschevaliersduzodiaque %23icavalieridellozodiaco %23bandai %23cdz";

interface ShareLinkProps {
  href: string;
  icon: "facebook" | "x";
  className: string;
}

function ShareLink({ href, icon, className }: ShareLinkProps) {
  return (
    <a
      className={`absolute -bottom-2 ${className} w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center bg-white group`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-5 md:w-10 md:group-hover:w-12 h-auto" name={icon} />
    </a>
  );
}

interface ShareBannerProps {
  saint: SaintProps;
  url: string;
}

export default function ShareBanner({ saint, url }: ShareBannerProps) {
  const t = useTranslations();
  const tweet = encodeURI(
    `${saint?.character?.name ?? "unknown"} - ${t(saint.history?.midia?.name)}: ${t(saint.history?.name)}`,
  );

  return (
    <div className="relative self-end">
      <h3 className="absolute top-9 md:top-20 -left-1 font-extrabold text-2xl md:text-5xl -rotate-6 uppercase">
        {t("share")}
      </h3>

      <Image
        className="w-72 md:w-[570px]"
        src="/banners/bg_share.png"
        alt={t("shareImage")}
        width={1044}
        height={398}
      />

      <ShareLink
        className="left-16 md:left-32"
        icon="facebook"
        href={`http://www.facebook.com/share.php?u=${url}`}
      />
      <ShareLink
        className="left-32 md:left-60"
        icon="x"
        href={`http://twitter.com/share?text=${tweet}+${SHARE_HASHTAGS}&url=${url}`}
      />
    </div>
  );
}
