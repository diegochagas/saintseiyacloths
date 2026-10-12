import Link from "next/link";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { SaintProps } from "@/pages/api/classes";
import Select from "./select";

// A linked entity (artist, class). Official sites open in a new tab; internal
// routes use <Link>; without a site only the name is shown.
interface DetailLink {
  id?: string;
  name?: string;
  site?: string;
  official?: unknown;
}

function DetailLinkName({ link }: { link: DetailLink }) {
  if (!link.id) return null;
  if (!link.site) return <>{link.name}</>;
  if (link.official) {
    return (
      <a
        className="hover:font-bold"
        href={link.site}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.name}
      </a>
    );
  }
  return (
    <Link className="hover:font-bold" href={link.site}>
      {link.name}
    </Link>
  );
}

function DetailItem({ title, children }: { title: string; children?: ReactNode }) {
  const t = useTranslations();

  return (
    <li className="list-disc">
      <h6 className="font-bold text-lg">{t(title)}</h6>
      {children}
    </li>
  );
}

// One "scheme by" line when the same artist drew character and cloth,
// otherwise one line each, with "unknown" for a cloth artist still missing.
function ArtistItems({ saint }: { saint: SaintProps }) {
  const t = useTranslations();
  const characterArtist = saint.artist;
  const clothArtist = saint.cloth?.artist;

  if (characterArtist && clothArtist && characterArtist.id === clothArtist.id) {
    return (
      <DetailItem title="schemeBy">
        <DetailLinkName link={characterArtist} />
      </DetailItem>
    );
  }
  if (!characterArtist && !clothArtist) {
    return <DetailItem title="schemeBy">{t("unknown")}</DetailItem>;
  }
  return (
    <>
      {characterArtist && (
        <DetailItem title="characterBy">
          <DetailLinkName link={characterArtist} />
        </DetailItem>
      )}
      {clothArtist && (
        <DetailItem title="clothBy">
          <DetailLinkName link={clothArtist} />
        </DetailItem>
      )}
      {!clothArtist && <DetailItem title="clothBy">{t("unknown")}</DetailItem>}
    </>
  );
}

function ClassItem({ saint }: { saint: SaintProps }) {
  const t = useTranslations();
  const saintClass: DetailLink = {
    id: saint.group?.id,
    name: t(saint.group?.class, { count: 1 }),
    site: `/classes?q=${saint.group?.class}&p=1`,
  };

  return (
    <DetailItem title="class">
      <DetailLinkName link={saintClass} />
    </DetailItem>
  );
}

// Other versions of the same character, as a <select> that navigates between them.
function OtherVersionsItem({ saint }: { saint: SaintProps }) {
  if (!saint.others || saint.others.length <= 1) return null;

  return (
    <DetailItem title="otherVersions">
      <Select options={saint.others} defaultOption={saint.id} />
    </DetailItem>
  );
}

// Shown only when the cloth debuted in a different story than this saint version.
function ClothReleaseItem({ saint }: { saint: SaintProps }) {
  const t = useTranslations();
  if (saint.cloth.history.id === saint.history.id) return null;

  return (
    <DetailItem title="clothRelease">
      {t(saint.cloth?.history?.name || "unknown")}
    </DetailItem>
  );
}

export default function DetailsList({ saint }: { saint: SaintProps }) {
  const t = useTranslations();

  return (
    <ul className="flex flex-col gap-2 ml-4 mt-10">
      <DetailItem title="god">{saint.god?.name}</DetailItem>
      <ClassItem saint={saint} />
      {saint.rank && <DetailItem title="rank">{t(saint.rank || "unknown")}</DetailItem>}
      <ArtistItems saint={saint} />
      <OtherVersionsItem saint={saint} />
      <ClothReleaseItem saint={saint} />
    </ul>
  );
}
