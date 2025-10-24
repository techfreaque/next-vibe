import {
  BarChart3,
  Brush,
  Building,
  Home,
  Info,
  MessageSquare,
  Tag,
  Video,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  BadgeTranslationPayload,
  NavSingleItemType,
} from "./nav-single-item";

export type NavPaths =
  | ""
  | "#pricing"
  | "#features"
  | "#process"
  | "/about-us"
  | "/careers"
  | "/app/dashboard"
  | "/"
  | "/app/social"
  | "/app/consultation"
  | "/subscription"
  | "/app/analytics"
  | "/help"
  | "/admin"
  | "/app/business-info"
  | "/app/business-info/profile"
  | "/app/business-info/business"
  | "/app/business-info/brand"
  | "/app/business-info/goals"
  | "/app/business-info/audience"
  | "/app/business-info/challenges"
  | "/app/business-info/competitors"
  | "/app/business-info/social";

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
    title: "app.nav.home",
    href: "",
  },
  {
    icon: <Tag className="h-4 w-4" />,
    title: "app.nav.pricing",
    href: "#pricing",
  },
  // {
  //   translationKey: "app.nav.blog",
  //   href: "/blog",
  // },
  // {
  //   translationKey: "app.nav.caseStudies",
  //   href: "/case-studies",
  // },

  {
    title: "app.nav.services.title",
    icon: <Brush className="h-4 w-4" />,
    children: [
      {
        icon: <Brush className="h-4 w-4" />,
        title: "app.nav.services.features.title",
        description: "app.nav.services.features.description",
        href: "#features",
      },
      {
        icon: <BarChart3 className="h-4 w-4" />,
        title: "app.nav.services.process.title",
        description: "app.nav.services.process.description",
        href: "#process",
      },
      {
        icon: <Video className="h-4 w-4" />,
        title: "app.nav.services.premiumContent.title",
        description: "app.nav.services.premiumContent.description",
        href: "#features",
      },
      // {
      //   icon: LayoutDashboard,
      //   title: "app.nav.services.dashboard.title",
      //   description: "app.nav.services.dashboard.description",
      //   href: "/dashboard",
      // } ,
      {
        icon: <MessageSquare className="h-4 w-4" />,
        title: "app.nav.services.contact.title",
        description: "app.nav.services.contact.description",
        href: "#features",
      },
    ],
  },
  {
    title: "app.nav.company",
    icon: <Building className="h-4 w-4" />,
    children: [
      {
        icon: <Info className="h-4 w-4" />,
        title: "app.nav.about.title",
        description: "app.nav.about.description",
        href: "/about-us",
      },
      {
        icon: <Building className="h-4 w-4" />,
        title: "app.nav.careers.title",
        description: "app.nav.careers.description",
        href: "/careers",
      },
    ],
  },
];
