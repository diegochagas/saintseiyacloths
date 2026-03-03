import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const getLocale = async () => {
  const defaultLanguage = "en";
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const acceptLanguage = headerStore.get("accept-language");
  const headerLocale = acceptLanguage?.split(",")[0];
  const languages = ["fr", "es", "pt", defaultLanguage];

  const language = (cookieLocale || headerLocale || defaultLanguage).split("-");
  // const locale = 'fr'
  return languages.find((lang) => language.includes(lang));
};

export default getRequestConfig(async () => {
  const locale = (await getLocale()) || "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
