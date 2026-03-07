/**
 * Emails Navigation Component
 * Navigation tabs for emails admin sections
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { Database } from "next-vibe-ui/ui/icons/Database";
import { List } from "next-vibe-ui/ui/icons/List";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface EmailsNavigationProps {
  locale: CountryLanguage;
  currentPage: "stats" | "list" | "imap" | "smtp";
}

export function EmailsNavigation({
  locale,
  currentPage,
}: EmailsNavigationProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const navigationItems = [
    {
      key: "stats",
      href: `/${locale}/admin/emails/stats` as const,
      icon: BarChart3,
      label: t("nav.overview"),
      description: t("admin.stats.title"),
    },
    {
      key: "list",
      href: `/${locale}/admin/emails/list` as const,
      icon: List,
      label: t("nav.campaigns"),
      description: t("admin.title"),
    },
    {
      key: "imap",
      href: `/${locale}/admin/emails/imap` as const,
      icon: Database,
      label: t("nav.imap"),
      description: t("imap.admin.overview.title"),
    },
    {
      key: "smtp",
      href: `/${locale}/admin/emails/smtp` as const,
      icon: Settings,
      label: t("nav.smtp"),
      description: t("nav.smtpDescription"),
    },
  ] as const;

  return (
    <Div className="flex flex flex-row gap-1 rounded-lg bg-muted p-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.key;

        return (
          <Button
            key={item.key}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </Div>
  );
}
