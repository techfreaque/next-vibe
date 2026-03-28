import { cn } from "next-vibe/shared/utils";
import type { BadgeVariant } from "next-vibe-ui/ui/badge";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import { scopedTranslation, type StoryComponentsTranslationKey } from "../i18n";
import type { NavPaths } from "./nav-constants";

/**
 * Translation payload for badge text with specific allowed types
 */
export interface BadgeTranslationPayload {
  readonly [key: string]: string | number;
}

export interface NavSingleItemType {
  icon: JSX.Element;
  title: StoryComponentsTranslationKey;
  href: NavPaths;
  children?: never;
  badge?: StoryComponentsTranslationKey | undefined;
  badgeTranslationPayload?: BadgeTranslationPayload | undefined;
  badgeVariant?: BadgeVariant | undefined;
  isActive?: boolean | undefined;
  disabled?: boolean | undefined;
  disabledReason?: StoryComponentsTranslationKey | undefined;
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
  const { t } = scopedTranslation.scopedT(locale);

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
    <Link href={`/${locale}${href}`}>
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
  title: StoryComponentsTranslationKey;
  badge: StoryComponentsTranslationKey | undefined;
  badgeTranslationPayload: BadgeTranslationPayload | undefined;
  badgeVariant: BadgeVariant | undefined;
  isActive: boolean | undefined;
  disabled: boolean | undefined;
  t: (
    key: StoryComponentsTranslationKey,
    params?: Record<string, string | number>,
  ) => TranslatedKeyType;
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
      {icon && <Span className="mr-2">{icon}</Span>}
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
          <Div>{children}</Div>
        </TooltipTrigger>
        <TooltipContent>
          <P>{reason}</P>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
