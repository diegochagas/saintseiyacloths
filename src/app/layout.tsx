import type { Metadata } from "next"
import { Inter } from "next/font/google"
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          
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
      </body>
    </html>
  );
}
