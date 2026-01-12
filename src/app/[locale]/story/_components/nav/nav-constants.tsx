import { Building, Home, Info, Sparkles, Tag } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  BadgeTranslationPayload,
  NavSingleItemType,
} from "./nav-single-item";

export type NavPaths =
  | ""
  | "/story#features"
  | "/subscription"
  | "/subscription/overview"
  | "/subscription/buy-credits"
  | "/subscription/history"
  | "/story"
  | "/story/about-us"
  | "/story/careers"
  | "/help"
  | "/admin";

export type NavItemType = NavSingleItemType | NavParentItemType;

/**
 * Badge variant types for navigation items
 */
export type NavBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | undefined;

export interface NavChildItem {
  icon: JSX.Element;
  title: TranslationKey;
  description: TranslationKey;
  href: NavPaths;
  children?: never;
  badge?: TranslationKey | undefined;
  badgeTranslationPayload?: BadgeTranslationPayload | undefined;
  badgeVariant?: NavBadgeVariant;
  isActive?: boolean | undefined;
  disabled?: boolean | undefined;
  disabledReason?: TranslationKey | undefined;
}

export interface NavParentItemType {
  title: TranslationKey;
  icon: JSX.Element;
  href?: never;
  children: NavChildItem[];
}

export const navItems: NavItemType[] = [
  {
    icon: <Home className="h-4 w-4" />,
    title: "app.story._components.nav.home",
    href: "/story",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "app.story._components.nav.features",
    href: "/story#features",
  },
  {
    icon: <Tag className="h-4 w-4" />,
    title: "app.story._components.nav.pricing",
    href: "/subscription/buy-credits",
  },
  {
    title: "app.story._components.nav.company",
    icon: <Building className="h-4 w-4" />,
    children: [
      {
        icon: <Info className="h-4 w-4" />,
        title: "app.story._components.nav.about.title",
        description: "app.story._components.nav.about.description",
        href: "/story/about-us",
      },
      {
        icon: <Building className="h-4 w-4" />,
        title: "app.story._components.nav.careers.title",
        description: "app.story._components.nav.careers.description",
        href: "/story/careers",
      },
    ],
  },
];
