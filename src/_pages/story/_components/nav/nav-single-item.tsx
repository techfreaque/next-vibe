import type { BadgeVariant } from "next-vibe/ui/ui/badge";
import type { JSX } from "react";

import type { StoryComponentsTranslationKey } from "../i18n";
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
