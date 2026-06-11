import { HistoryProps } from "@/pages/api/history";

function formatRank(rank: string, locale: string) {
  if (locale === "pt") {
    if (rank === "Deus") return "Divina";
    else if (rank === "Negro") return "Negra";
    return ` de ${rank}`;
  } else return rank;
}

export function getClothName(
  name: string,
  locale: string,
  cls: string,
  rank: string,
  version: string
) {
  const formattedVersion = version ? ` (${version})` : "";

  if (locale === "pt" || locale === "es") {
    if (name) {
      if (name === "Super") return "Super Armadura Negra";
      else if (name === "Synapse")
        return locale === "pt"
          ? "Suprema Armadura de Ouro Sinapse"
          : "Armadura Dorada Suprema Synapse";
      return `${cls ? cls : ""} ${rank ? formatRank(rank, locale) : ""} ${
        name !== "Básica" ? "de " : ""
      }${name}${formattedVersion}`;
    } else {
      return `${cls ? cls : ""} ${
        rank ? formatRank(rank, locale) : ""
      } ${formattedVersion}`;
    }
  } else if (locale === "fr") {
    if (name) {
      if (name === "Super") return "Super Armure Noire";
      else if (name === "Synapse") return "Suprême Armure d'Or Synapse";
      return `${cls ? cls : ""}${
        rank ? ` du ${rank}` : ""
      } du ${name}${formattedVersion}`;
    } else {
      return `${cls ? cls : ""}${rank ? ` ${rank}` : ""} ${formattedVersion}`;
    }
  } else if (name === "Super") return "Super Black Cloth";
  else if (name === "Synapse") return "Supreme Synapse Gold Cloth";
  return `${name} ${rank ? ` ${rank}` : ""} ${
    cls ? ` ${cls}` : ""
  }${formattedVersion}`;
}

export function getName(
  name: string,
  clothName: string,
  locale: string,
  cls: string,
  version: string,
  rank: string = ""
) {
  const formattedVersion = version ? ` (${version})` : "";

  if (
    name &&
    (name.toLocaleLowerCase() === clothName.toLocaleLowerCase() || !clothName)
  ) {
    return `${name}${formattedVersion}`;
  } else if (locale === "pt" || locale === "es") {
    if (!name) {
      if (!clothName && rank) return `${cls} ${rank} ${formattedVersion}`;
      else if (cls === clothName) return cls;
      else return `${cls} de ${clothName}`;
    } else {
      let cloth = clothName;
      if (clothName === "Super") cloth = "Super Armadura Negra";
      else if (clothName === "Synapse") {
        cloth =
          locale === "pt"
            ? "Suprema Armadura de Ouro Sinapse"
            : "Armadura Dorada Suprema Synapse";
      }
      return `${name} de ${cloth}${formattedVersion}`;
    }
  } else if (locale === "fr") {
    if (!name) {
      if (!clothName && rank) return `${cls} ${rank} ${formattedVersion}`;
      else if (cls === clothName) return cls;
      else return `${cls} de ${clothName}`;
    } else {
      let cloth = clothName;
      if (clothName === "Super") cloth = "Super Armure Noire";
      else if (clothName === "Synapse") cloth = "Suprême Armure d'Or Synapse";
      return `${name} du ${cloth}${formattedVersion}`;
    }
  } else if (!clothName && rank) return `${rank} ${cls}${formattedVersion}`;
  let cloth = clothName;
  if (clothName === "Super") cloth = "Super Black Cloth";
  else if (clothName === "Synapse") cloth = "Supreme Synapse Gold Cloth";

  return `${cloth} ${name || cls}${formattedVersion}`;
}

export function getHistory(t: (key: string) => string, history?: HistoryProps) {
  if (!history?.midia) return t("neverReleased");

  const name = t(history.name);
  const midia = t(history.midia.name);

  // some entries repeat the same label (e.g. "Never released") in both fields
  return name === midia ? name : `${name} (${midia})`;
}
