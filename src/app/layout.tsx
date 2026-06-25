import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { MenuProvider } from "./context/menu-context";
import Header from "./components/header";
import Footer from "./components/footer";
import { LoadingProvider } from "./context/loading-content";
import Loading from "./components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Saint Seiya Cloths — Cloth Schemes Encyclopedia",
    template: "%s | Saint Seiya Cloths",
  },
  description:
    "The encyclopedia of Saint Seiya cloth schemes: armors of Athena's Saints, Hades' Specters, Poseidon's Marinas and more, with artists, ranks and first appearances.",
  keywords: [
    "Saint Seiya",
    "cloth schemes",
    "Knights of the Zodiac",
    "Cavaleiros do Zodíaco",
    "Caballeros del Zodiaco",
    "Cloth Myth",
    "armor",
    "Athena",
    "Specters",
    "Gold Saints",
  ],
  metadataBase: new URL("https://www.saintseiyacloths.com/"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Saint Seiya Cloths",
    title: "Saint Seiya Cloths — Cloth Schemes Encyclopedia",
    description:
      "The encyclopedia of Saint Seiya cloth schemes: armors of Athena's Saints, Hades' Specters, Poseidon's Marinas and more.",
    images: ["/banners/saint-seiya-cloths-banner-horizontal.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint Seiya Cloths — Cloth Schemes Encyclopedia",
    description:
      "The encyclopedia of Saint Seiya cloth schemes: armors of Athena's Saints, Hades' Specters, Poseidon's Marinas and more.",
    images: ["/banners/saint-seiya-cloths-banner-horizontal.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <MenuProvider>
            <Header />

            <LoadingProvider>
              <Loading />

              <main className="w-full flex flex-col items-center relative z-10">
                {children}
              </main>
            </LoadingProvider>

            <Footer />

            <div className="fixed z-0 top-16 bottom-0 left-0 right-0 w-full h-full bg-[url('/banners/bg_comics.jpg')] md:bg-[url('/banners/bg_comics_pc.jpg')]" />
          </MenuProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
