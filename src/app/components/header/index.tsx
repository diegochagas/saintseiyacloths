"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Icon, { iconName } from "../icons";
import ScrollTop from "../scroll-top";
import menu from "../../../pages/api/data/menu.json";
import socials from "../../../pages/api/data/socials.json";
import { usePathname } from "next/navigation";
import { useMenu } from "@/app/context/menu-context";

const mobileQuery = "(max-width: 767px)";

function subscribeToMediaQuery(callback: () => void) {
  const mediaQuery = window.matchMedia(mobileQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeToMediaQuery,
    () => window.matchMedia(mobileQuery).matches,
    () => false
  );
}

interface MenuEntry {
  text: string;
  href: string;
}

interface NavMenuItemProps {
  item: MenuEntry;
  isActive: boolean;
  onNavigate: () => void;
}

function NavMenuItem({ item, isActive, onNavigate }: NavMenuItemProps) {
  const t = useTranslations();

  return (
    <li
      className={`${isActive ? "text-yellow-500" : "hover:text-yellow-500 text-white"} group`}
      onClick={onNavigate}
      data-testid={`menu-${item.text}`}
    >
      <Link className="flex items-center gap-4 md:gap-2 lg:gap-4" href={item.href}>
        <Icon
          className={isActive ? "fill-yellow-500" : "group-hover:fill-yellow-500"}
          name={item.text as iconName}
          color="white"
        />
        <span className="text-2xl md:text-lg lg:text-xl font-bold">{t(item.text)}</span>
      </Link>
    </li>
  );
}

interface NavMenuProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
}

// Full-screen overlay on mobile while open, a black bar under the header otherwise.
function NavMenu({ isMenuOpen, closeMenu }: NavMenuProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const navClassName =
    isMenuOpen && isMobile
      ? 'bg-[url("/banners/bg_menu.jpg")] bg-center bg-cover h-screen'
      : "bg-black mt-[60px] lg:mt-[92px] flex justify-center";
  const listClassName = isMenuOpen ? "flex-col gap-4 justify-center h-full" : "justify-between";
  const listDisplay = !isMenuOpen && isMobile ? "hidden" : "flex";

  return (
    <nav className={`${navClassName} w-full fixed uppercase z-30`}>
      <ul
        className={`${listClassName} ${listDisplay} w-full max-w-7xl py-2.5 px-6 transition-opacity duration-200`}
      >
        {menu.map((item) => (
          <NavMenuItem
            key={item.text}
            item={item}
            isActive={pathname === item.href}
            onNavigate={closeMenu}
          />
        ))}
      </ul>
    </nav>
  );
}

export default function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const x = socials.find((social) => social.text === "X");

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
          aria-label="Menu"
          aria-expanded={isMenuOpen}
          data-testid="menu"
        >
          <b className="relative block w-9 h-9">
            <Icon name={isMenuOpen ? "close" : "menu"} />
          </b>
        </button>

        <span className="hidden md:block" />
      </header>

      <NavMenu isMenuOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />

      <ScrollTop />
    </>
  );
}
