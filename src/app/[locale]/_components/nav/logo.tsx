"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import Image from "next/image";
import logo from "./bottled.ai-logo.png"
import logoBlack from "./bottled.ai-logo-black.png"
import { cn } from "@/packages/next-vibe/shared/utils";

export function Logo({
  locale,
  pathName,
  className,
}: {
  locale: CountryLanguage;
    pathName: "" | "/app/onboarding" | "/app/dashboard" | "/chat";
  className?: string;
}): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <>
      {/* Desktop logo */}
      <Link
        href={`/${locale}${pathName}`}
        // className="items-center"
      >
        {/* <div className="flex flex-col items-start"> */}
          <Image
            src={logo}
            alt={t("common.appName")}
            width={250}
            height={80}
            className={cn("h-18 w-auto", className)}
            priority
          />
        {/* </div> */}
      </Link>
    </>
  );
}
