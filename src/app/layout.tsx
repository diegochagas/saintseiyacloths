import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import "./globals.css"
import { MenuProvider } from "./context/menu-context";
import Header from "./components/header";
import Footer from "./components/footer";
import { LoadingProvider } from "./context/loading-content";
import Loading from "./components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saint Seiya Cloths",
  description: "This website showcases the Cloth Schemes of all Saint Seiya characters.",
  metadataBase: new URL('https://www.saintseiyacloths.com/'),
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
