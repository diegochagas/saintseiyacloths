"use client";

import { MouseEvent, useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import Icon from "../icons";
import { useMenu } from "../../context/menu-context";
import { useTranslations } from "next-intl";

export default function ScrollTop() {
  const t = useTranslations();
  const { isMenuOpen } = useMenu();
  const [showArrow, setShowArrow] = useState(false);
  const opacity = showArrow ? "opacity-100" : "opacity-0";

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY >= 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function onScrollTo(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    animateScroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }

  return (
    <a
      href="#"
      className={`${
        isMenuOpen ? "hidden" : "block"
      } fixed right-4 lg:right-8 bottom-1 z-50 ${opacity} transition-all duration-300`}
      onClick={onScrollTo}
    >
      <p className="uppercase absolute right-0 bottom-0 text-xl leading-5 lg:text-2xl lg:leading-6 font-black text-stroke-white text-end">
        {t("pageTop")}
      </p>
      <Icon className="w-20 lg:w-28 h-auto" name="nike-stroke" />
    </a>
  );
}
