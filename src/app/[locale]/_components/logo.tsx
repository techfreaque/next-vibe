"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import logoBlack from "./unbottled-icon.png";
import logoWhite from "./unbottled-icon-white.png";

export function Logo({
  locale,
  pathName = "",
  className,
  linkClassName,
  size = "h-7",
  disabled
}: {
  locale: CountryLanguage;
  pathName?: string;
  className?: string;
  linkClassName?: string;
  size?: string;
  disabled?: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Component = disabled ? Div : Link; 
  return (
    <Component
      href={`/${locale}${pathName}`}
      className={cn(
        "inline-flex items-center gap-1.5 no-underline! hover:no-underline!",
        linkClassName,
      )}
    >
      <Div className={cn("shrink-0", size)}>
        <Image
          fetchPriority="high"
          src={logoWhite}
          alt={t("config.appName")}
          className={cn(
            "hidden dark:block h-full w-auto object-contain",
            className,
          )}
          priority
        />
        <Image
          fetchPriority="high"
          src={logoBlack}
          alt={t("config.appName")}
          className={cn(
            "hidden light:block h-full w-auto object-contain",
            className,
          )}
          priority
        />
      </Div>
      <span
        className={cn(
          "font-inter text-base font-bold tracking-tight whitespace-nowrap",
          "text-gray-900 dark:text-white",
        )}
      >
        {t("config.appName")}
      </span>
    </Component>
  );
}
