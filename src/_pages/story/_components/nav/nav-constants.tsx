import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Tag } from "next-vibe/ui/components/icons/Tag";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import type { JSX } from "react";

import type { StoryComponentsTranslationKey } from "../i18n";
import type {
  BadgeTranslationPayload,
  NavSingleItemType,
} from "./nav-single-item";

export type NavPaths =
  | ""
  | "/subscription"
  | "/subscription/overview"
  | "/subscription/buy"
  | "/subscription/overview"
  | "/subscription/history"
  | "/story"
  | "/story/about-us"
  | "/story/blog"
  | "/story/careers"
  | "/story/framework"
  | "/story/self-host"
  | "/story/earn"
  | "/story/invest"
  | "/help"
  | "/admin"
  | "/threads"
  | "/user/settings"
  | "/user/referral";

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
  title: StoryComponentsTranslationKey;
  description: StoryComponentsTranslationKey;
  href: NavPaths;
  children?: never;
  badge?: StoryComponentsTranslationKey | undefined;
  badgeTranslationPayload?: BadgeTranslationPayload | undefined;
  badgeVariant?: NavBadgeVariant;
  isActive?: boolean | undefined;
  disabled?: boolean | undefined;
  disabledReason?: StoryComponentsTranslationKey | undefined;
}

export interface NavParentItemType {
  title: StoryComponentsTranslationKey;
  icon: JSX.Element;
  href?: never;
  children: NavChildItem[];
}

/**
 * Public site navigation. Ordered by what visitors come for:
 * price first, then the three "beyond chat" paths, then reading, then company.
 * "Start chatting" lives in the auth buttons as the primary action.
 */
export const navItems: NavItemType[] = [
  {
    icon: <Tag className="h-4 w-4" />,
    title: "nav.pricing",
    href: "/subscription/overview",
  },
  {
    icon: <Server className="h-4 w-4" />,
    title: "nav.selfHost",
    href: "/story/self-host",
  },
  {
    icon: <Code className="h-4 w-4" />,
    title: "nav.developers",
    href: "/story/framework",
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "nav.earn",
    href: "/story/earn",
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "nav.blog.title",
    href: "/story/blog",
  },
  {
    title: "nav.company",
    icon: <Building className="h-4 w-4" />,
    children: [
      {
        icon: <Info className="h-4 w-4" />,
        title: "nav.about.title",
        description: "nav.about.description",
        href: "/story/about-us",
      },
      {
        icon: <Building className="h-4 w-4" />,
        title: "nav.careers.title",
        description: "nav.careers.description",
        href: "/story/careers",
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        title: "nav.invest.title",
        description: "nav.invest.description",
        href: "/story/invest",
      },
    ],
  },
];
