import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-intl and its dependencies ship ESM only; transpiling them lets next/jest transform them too
  transpilePackages: [
    "next-intl",
    "use-intl",
    "intl-messageformat",
    "@formatjs/fast-memoize",
    "@formatjs/icu-messageformat-parser",
    "@formatjs/icu-skeleton-parser",
    "@formatjs/ecma402-abstract",
    "@formatjs/intl-localematcher",
  ],
};

export default withNextIntl(nextConfig);
