import { BookOpen } from "next-vibe-ui/ui/icons/BookOpen";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
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
  | "/story/invest"
  | "/help"
  | "/admin"
  | "/threads";

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

export const navItems: NavItemType[] = [
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "nav.features",
    href: "/story",
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    title: "nav.goToApp",
    href: "/threads",
  },
  {
    icon: <Code className="h-4 w-4" />,
    title: "nav.framework",
    href: "/story/framework",
  },
  {
    icon: <Tag className="h-4 w-4" />,
    title: "nav.pricing",
    href: "/subscription/overview",
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
      {
        icon: <BookOpen className="h-4 w-4" />,
        title: "nav.blog.title",
        description: "nav.blog.description",
        href: "/story/blog",
      },
    ],
  },
];
