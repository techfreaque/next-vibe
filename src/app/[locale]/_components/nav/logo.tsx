"use client";

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

export function Logo({}: {
  locale: CountryLanguage;
  pathName?: "" | "/app/onboarding" | "/app/dashboard" | "/chat";
  className?: string;
}): JSX.Element {
  return (
    <>
      {/* Desktop logo */}
      {/* <Link
        href={`/${locale}${pathName}`}
      >
          <Image
            src={logo}
            alt={t("common.appName")}
            width={250}
            height={80}
            className={cn("hidden dark:block h-18 w-auto", className)}
            priority
          />
          <Image
            src={logoBlack}
            alt={t("common.appName")}
            width={250}
            height={80}
            className={cn("hidden light:block h-18 w-auto", className)}
            priority
          />
      </Link> */}
    </>
  );
}
