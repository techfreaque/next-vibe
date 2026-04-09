"use client";

import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

type SubNavTab = "settings" | "referral";

interface UserSubNavProps {
  locale: CountryLanguage;
  active: SubNavTab;
}

export function UserSubNav({ locale, active }: UserSubNavProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const tabs = [
    {
      id: "settings" as SubNavTab,
      label: t("subNav.settings"),
      href: `/${locale}/user/settings`,
      icon: Settings,
    },
    {
      id: "referral" as SubNavTab,
      label: t("subNav.referral"),
      href: `/${locale}/user/referral`,
      icon: TrendingUp,
    },
  ];

  return (
    <Div className="mb-8">
      {/* Back to app */}
      <Div className="mb-4">
        <Link
          href={`/${locale}/threads`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <Span>{t("subNav.backToApp")}</Span>
        </Link>
      </Div>

      {/* Tab strip */}
      <Div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-violet-500 text-violet-600 dark:text-violet-400"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <Span>{tab.label}</Span>
            </Link>
          );
        })}
      </Div>
    </Div>
  );
}
