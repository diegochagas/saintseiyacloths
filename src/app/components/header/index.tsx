"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Icon, { iconName } from "../icons";
import ScrollTop from "../scroll-top";
import menu from "../../../pages/api/data/menu.json";
import socials from "../../../pages/api/data/socials.json";
import { usePathname } from "next/navigation";
import { useMenu } from "@/app/context/menu-context";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const [isMobile, setIsMobile] = useState(false);
  const x = socials.find((social) => social.text === "X");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  return (
    <>
      <header className="fixed bg-white z-40 w-full flex px-3.5 py-1.5 justify-between border-b-8 border-b-black items-center text-neutral-300 uppercase font-bold transition-all duration-300 ease-linear">
        <a href={x?.href} target="_blank" rel="noopener noreferrer">
          <Icon className="w-5 lg:w-6 h-auto" name="x" />
        </a>

        <Link href="/">
          <Image
            className="w-auto h-12 lg:h-20"
            src="/logos/saint-seiya-cloths-logo.png"
            alt="Saint Seiya Cloths logo"
            width={400}
            height={153}
          />
        </Link>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          data-testid="menu"
        >
          <b className="relative block w-9 h-9">
            <Icon name={isMenuOpen ? "close" : "menu"} />
          </b>
        </button>

        <span className="hidden md:block" />
      </header>

      <nav
        className={`${
          isMenuOpen && isMobile
            ? 'bg-[url("/banners/bg_menu.jpg")] bg-center bg-cover h-screen'
            : "bg-black mt-[60px] lg:mt-[92px] flex justify-center"
        } w-full fixed uppercase z-30`}
      >
        <ul
          className={`${
            isMenuOpen
              ? "flex-col gap-4 justify-center h-full"
              : "justify-between"
          } ${
            !isMenuOpen && isMobile ? "hidden" : "flex"
          } w-full max-w-7xl py-2.5 px-6 transition-opacity duration-200`}
        >
          {menu.map((item) => (
            <li
              key={item.text}
              className={`${
                pathname === item.href
                  ? "text-yellow-500"
                  : "hover:text-yellow-500 text-white"
              } group`}
              onClick={() => setIsMenuOpen(false)}
              data-testid={`menu-${item.text}`}
            >
              <Link
                className="flex items-center gap-4 md:gap-2 lg:gap-4"
                href={item.href}
              >
                <Icon
                  className={
                    pathname === item.href
                      ? "fill-yellow-500"
                      : "group-hover:fill-yellow-500"
                  }
                  name={item.text as iconName}
                  color="white"
                />
                <span className="text-2xl md:text-lg lg:text-xl font-bold">
                  {t(item.text)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ScrollTop />
    </>
  );
}
