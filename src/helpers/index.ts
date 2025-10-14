export function getClothName(t: (key: string) => string, strings?: string[]) {
  return strings
    ? strings.reduce(
        (acc, curr, index) => acc + (index === 0 ? t(curr) : ` (${t(curr)})`),
        ""
      )
    : t("unknown");
}

export function getName(name: string, clothName: string, locale: string) {
  if (name === clothName) return name;
  else if ((locale === "pt" || locale === "es") && clothName)
    return `${name} de ${clothName}`;
  else return `${clothName} ${name}`;
}
