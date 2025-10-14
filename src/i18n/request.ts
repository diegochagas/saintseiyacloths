import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const getLocale = () => {
  const defaultLanguage = "en";
  const cookieLocale = cookies().get("NEXT_LOCALE")?.value;
  const acceptLanguage = headers().get("accept-language");
  const headerLocale = acceptLanguage?.split(",")[0];
  const languages = ["fr", "es", "pt", defaultLanguage];

  const language = (cookieLocale || headerLocale || defaultLanguage).split("-");
  // const locale = 'fr'
  return languages.find((lang) => language.includes(lang));
};

export default getRequestConfig(async () => {
  const locale = getLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
