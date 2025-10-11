import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui";
import type { BadeVariant } from "next-vibe-ui/ui/badge";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import type { NavPaths } from "./nav-constants";

/**
 * Translation payload for badge text with specific allowed types
 */
export interface BadgeTranslationPayload {
  readonly [key: string]: string | number;
}

export interface NavSingleItemType {
  icon: JSX.Element;
  title: TranslationKey;
  href: NavPaths;
  children?: never;
  badge?: TranslationKey | undefined;
  badgeTranslationPayload?: BadgeTranslationPayload | undefined;
  badgeVariant?: BadeVariant | undefined;
  isActive?: boolean | undefined;
  disabled?: boolean | undefined;
  disabledReason?: TranslationKey | undefined;
}

export interface NavSingleItemProps extends NavSingleItemType {
  locale: CountryLanguage;
}

export function NavSingleItem({
  href,
  icon,
  title,
  badge,
  badgeTranslationPayload,
  badgeVariant,
  isActive,
  disabled,
  disabledReason,
  locale,
}: NavSingleItemProps): JSX.Element {
  const { t } = simpleT(locale);

  if (disabled && disabledReason) {
    return (
      <DisabledButton reason={t(disabledReason)}>
        <NavButton
          icon={icon}
          title={title}
          badge={badge}
          badgeTranslationPayload={badgeTranslationPayload}
          badgeVariant={badgeVariant}
          isActive={isActive}
          disabled={disabled}
          t={t}
        />
      </DisabledButton>
    );
  }

  return (
    <Link href={`/${locale}${href}`} as={href}>
      <NavButton
        icon={icon}
        title={title}
        badge={badge}
        badgeTranslationPayload={badgeTranslationPayload}
        badgeVariant={badgeVariant}
        isActive={isActive}
        disabled={disabled}
        t={t}
      />
    </Link>
  );
}

function NavButton({
  icon,
  title,
  badge,
  badgeTranslationPayload,
  badgeVariant,
  isActive,
  disabled,
  t,
}: {
  icon: JSX.Element;
  title: TranslationKey;
  badge: TranslationKey | undefined;
  badgeTranslationPayload: BadgeTranslationPayload | undefined;
  badgeVariant: BadeVariant | undefined;
  isActive: boolean | undefined;
  disabled: boolean | undefined;
  t: TFunction;
}): JSX.Element {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={cn(
        "relative h-9 px-3",
        isActive && "bg-primary text-primary-foreground",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {title && t(title)}
      {badge && (
        <Badge
          variant={badgeVariant || "secondary"}
          className="ml-2 h-5 px-1.5 text-xs"
        >
          {t(badge, badgeTranslationPayload)}
        </Badge>
      )}
    </Button>
  );
}

function DisabledButton({
  children,
  reason,
}: {
  children: ReactNode;
  reason: string;
}): JSX.Element {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{children}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
