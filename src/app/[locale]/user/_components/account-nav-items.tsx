import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { ShoppingCart } from "next-vibe-ui/ui/icons/ShoppingCart";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";

import type { NavItemType } from "@/app/[locale]/story/_components/nav/nav-constants";

export const accountNavItems: NavItemType[] = [
  {
    icon: <ArrowLeft className="h-4 w-4" />,
    title: "nav.backToChat",
    href: "/threads",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    title: "nav.unbottledHome",
    href: "/story",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    title: "nav.settings",
    href: "/user/settings",
  },
  {
    icon: <ShoppingCart className="h-4 w-4" />,
    title: "nav.subscription",
    href: "/subscription/overview",
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "nav.referral",
    href: "/user/referral",
  },
];
