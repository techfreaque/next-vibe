/**
 * Cron Navigation Component
 * Navigation component for switching between different cron management pages
 */

"use client";

import { cn } from "next-vibe/shared/utils/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Activity, History, List, TrendingUp } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CronNavigationProps {
  locale: CountryLanguage;
  currentPage?:
    | "overview"
    | "status"
    | "tasks"
    | "history"
    | "stats"
    | "settings";
  children?: React.ReactNode;
}

export function CronNavigation({
  locale,
  currentPage = "overview",
  children,
}: CronNavigationProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const navigationItems = [
    {
      key: "status",
      href: `/${locale}/admin/cron/status`,
      icon: Activity,
      label: t("app.admin.cron.nav.status"),
      description: t("app.admin.cron.nav.status_description"),
    },
    {
      key: "stats",
      href: `/${locale}/admin/cron/stats`,
      icon: TrendingUp,
      label: t("app.admin.cron.nav.stats"),
      description: t("app.admin.cron.nav.stats_description"),
    },
    {
      key: "tasks",
      href: `/${locale}/admin/cron/tasks`,
      icon: List,
      label: t("app.admin.cron.nav.tasks"),
      description: t("app.admin.cron.nav.tasks_description"),
    },
    {
      key: "history",
      href: `/${locale}/admin/cron/history`,
      icon: History,
      label: t("app.admin.cron.nav.history"),
      description: t("app.admin.cron.nav.history_description"),
    },
  ];

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === currentPage;

              return (
                <Link key={item.key} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-auto p-4 flex flex-col items-start gap-2 w-full",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent",
                    )}
                  >
                    <Div className="flex items-center flex flex-row gap-2 w-full">
                      <Icon className="h-5 w-5" />
                      <Span className="font-medium">{item.label}</Span>
                      {isActive && (
                        <Badge variant="secondary" className="ml-auto">
                          {t("app.admin.common.active")}
                        </Badge>
                      )}
                    </Div>
                    <P className="text-sm text-left opacity-80">
                      {item.description}
                    </P>
                  </Button>
                </Link>
              );
            })}
          </Div>
        </CardContent>
      </Card>
      {children}
    </>
  );
}
