import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [
      ".next/**",
      ".swc/**",
      "node_modules/**",
      "coverage/**",
      "public/mockServiceWorker.js",
    ],
  },
  {
    // ImageResponse (next/og) renders its own JSX and cannot use next/image
    files: ["**/opengraph-image.tsx", "**/twitter-image.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
