"use client";

import type { Route } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { envClient, platform } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

export function Logo({
  locale,
  pathName = "",
  className,
  linkClassName,
  size = "h-7",
  disabled,
}: {
  locale: CountryLanguage;
  pathName?: string;
  className?: string;
  linkClassName?: string;
  size?: string;
  disabled?: boolean;
}): JSX.Element {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const innerClassName = cn(
    "inline-flex items-center gap-1.5 no-underline! hover:no-underline!",
    linkClassName,
  );
  const inner = (
    <>
      <Div className={cn("shrink-0", size)}>
        <Image
          fetchPriority="high"
          src={`${platform.isReactNative ? envClient.NEXT_PUBLIC_APP_URL : ""}/images/unbottled-icon-white.png`}
          alt={configT("appName")}
          className={cn(
            "hidden dark:block h-full w-auto object-contain",
            className,
          )}
          width={32}
          height={32}
          priority
        />
        <Image
          fetchPriority="high"
          src={`${platform.isReactNative ? envClient.NEXT_PUBLIC_APP_URL : ""}/images/unbottled-icon.png`}
          alt={configT("appName")}
          className={cn(
            "hidden light:block h-full w-auto object-contain",
            className,
          )}
          width={32}
          height={32}
          priority
        />
      </Div>
      <Span
        className={cn(
          "font-inter text-base font-bold tracking-tight whitespace-nowrap",
          "text-gray-900 dark:text-white",
        )}
      >
        {configT("appName")}
      </Span>
    </>
  );
  if (disabled) {
    return <Div className={innerClassName}>{inner}</Div>;
  }
  if (isLocalMode) {
    return (
      <Link
        href={envClient.NEXT_PUBLIC_PROJECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={innerClassName}
      >
        {inner}
      </Link>
    );
  }
  const localeHref: Route<`/${CountryLanguage}${string}`> = `/${locale}${pathName}`;
  return (
    <Link href={localeHref} className={innerClassName}>
      {inner}
    </Link>
  );
}
