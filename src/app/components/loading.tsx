"use client";

import { useLoading } from "../context/loading-content";
import Icon from "./icons";

export default function Loading() {
  const { isLoading, loadingBg } = useLoading();

  return isLoading ? (
    <div
      className={`fixed w-full h-full ${loadingBg} flex justify-center items-center z-50`}
    >
      <Icon name="zodiac-wheel" color="black" />
    </div>
  ) : null;
}
