"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { cn } from "@/packages/next-vibe/shared";

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
        alt={t("app.common.appName")}
        width={250}
        height={80}
        className={cn("hidden dark:block h-18 w-auto", className)}
        priority
      />
      <Image
        fetchPriority="high"
        src={logoBlack}
        alt={t("app.common.appName")}
        width={250}
        height={80}
        className={cn("hidden light:block h-18 w-auto", className)}
        priority
      />
    </Link>
  );
}
