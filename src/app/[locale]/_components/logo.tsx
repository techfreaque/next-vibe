"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { envClient, platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const { t } = simpleT(locale);
  const Component = disabled ? Div : Link;
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const href = isLocalMode
    ? envClient.NEXT_PUBLIC_PROJECT_URL
    : `/${locale}${pathName}`;
  return (
    <Component
      href={href}
      target={isLocalMode ? "_blank" : undefined}
      rel={isLocalMode ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 no-underline! hover:no-underline!",
        linkClassName,
      )}
    >
      <Div className={cn("shrink-0", size)}>
        <Image
          fetchPriority="high"
          src={`${platform.isReactNative ? envClient.NEXT_PUBLIC_APP_URL : ""}/images/unbottled-icon-white.png`}
          alt={t("config.appName")}
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
          alt={t("config.appName")}
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
        {t("config.appName")}
      </Span>
    </Component>
  );
}
