import {
  BarChart3,
  Bot,
  Building,
  Folder,
  Home,
  Info,
  MessageSquare,
  Sparkles,
  Tag,
  Users,
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
    title: "app.story._components.nav.home",
    href: "",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "app.story._components.nav.features",
    href: "#features",
  },
  {
    icon: <Tag className="h-4 w-4" />,
    title: "app.story._components.nav.pricing",
    href: "#pricing",
  },
  {
    title: "app.story._components.nav.services.title",
    icon: <MessageSquare className="h-4 w-4" />,
    children: [
      {
        icon: <Bot className="h-4 w-4" />,
        title: "app.story._components.nav.services.aiModels.title",
        description: "app.story._components.nav.services.aiModels.description",
        href: "#features",
      },
      {
        icon: <Folder className="h-4 w-4" />,
        title: "app.story._components.nav.services.folders.title",
        description: "app.story._components.nav.services.folders.description",
        href: "#features",
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: "app.story._components.nav.services.personas.title",
        description: "app.story._components.nav.services.personas.description",
        href: "#features",
      },
      {
        icon: <BarChart3 className="h-4 w-4" />,
        title: "app.story._components.nav.services.process.title",
        description: "app.story._components.nav.services.process.description",
        href: "#process",
      },
    ],
  },
  {
    title: "app.story._components.nav.company",
    icon: <Building className="h-4 w-4" />,
    children: [
      {
        icon: <Info className="h-4 w-4" />,
        title: "app.story._components.nav.about.title",
        description: "app.story._components.nav.about.description",
        href: "/about-us",
      },
      {
        icon: <Building className="h-4 w-4" />,
        title: "app.story._components.nav.careers.title",
        description: "app.story._components.nav.careers.description",
        href: "/careers",
      },
    ],
  },
];
