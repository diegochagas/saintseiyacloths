import { HistoryProps } from "@/pages/api/history";

export function getClothName(
  name: string,
  locale: string,
  cls: string,
  rank: string
) {
  if ((locale === "pt" || locale === "es") && name)
    return `${cls ? `${cls} de ` : ""} ${rank ? `${rank} de ` : ""}${name}`;
  if (locale === "fr" && name)
    return `${cls ? `${cls} du ` : ""}${rank ? `${rank} du ` : ""}${name}`;
  else return `${name} ${rank ? ` ${rank}` : ""} ${cls ? ` ${cls}` : ""}`;
}

// export function getClothName(t: (key: string) => string, strings?: string[]) {
//   return strings
//     ? strings.reduce(
//         (acc, curr, index) => acc + (index === 0 ? t(curr) : ` (${t(curr)})`),
//         ""
//       )
//     : t("unknown");
// }

export function getName(
  name: string,
  clothName: string,
  locale: string,
  rank: string
) {
  if (name === clothName) return name;
  else if (!clothName) return name;
  else if (locale === "pt" || locale === "es")
    return !name ? `${rank} de ${clothName}` : `${name} de ${clothName}`;
  else if (locale === "fr" && name)
    return !name ? `${rank} du ${clothName}` : `${name} du ${clothName}`;
  else return `${clothName} ${name ?? rank}`;
}

export function getHistory(t: (key: string) => string, history?: HistoryProps) {
  return history
    ? `${t(history.name)} (${t(history.midia.name)})`
    : t("neverReleased");
}
