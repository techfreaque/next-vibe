"use client";

import { cn } from "next-vibe/shared/utils";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import logoBlack from "./uai-logo-black.png";
import logoWhite from "./uai-logo-white.png";

export function Logo({
  locale,
  pathName,
  className,
  linkClassName,
}: {
  locale: CountryLanguage;
  pathName: string;
  className?: string;
  linkClassName?: string;
}): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Link href={`/${locale}${pathName}`} className={linkClassName}>
      <Image
        fetchPriority="high"
        src={logoWhite}
        alt={t("config.appName")}
        className={cn("hidden dark:block h-5 w-auto", className)}
        priority
      />
      <Image
        fetchPriority="high"
        src={logoBlack}
        alt={t("config.appName")}
        className={cn("hidden light:block h-5 w-auto", className)}
        priority
      />
    </Link>
  );
}
