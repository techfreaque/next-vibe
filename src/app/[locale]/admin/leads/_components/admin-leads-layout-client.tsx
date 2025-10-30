/**
 * Admin Leads Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next/navigation";
import { Div } from "next-vibe-ui/ui";
import { H1 } from "next-vibe-ui/ui";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImportStatusAlert } from "./import-status-alert";
import { LeadsNavigation } from "./leads-navigation";

interface AdminLeadsLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

export enum CurrentPageType {
  stats = "stats",
  list = "list",
  emails = "emails",
  abTesting = "ab-testing",
  campaignStarter = "campaign-starter",
}

export function AdminLeadsLayoutClient({
  children,
  locale,
}: AdminLeadsLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();
  const { t } = simpleT(locale);

  // Determine current page from pathname
  const getCurrentPage = (): CurrentPageType => {
    if (pathname.includes("/admin/leads/list")) {
      return CurrentPageType.list;
    }
    if (pathname.includes("/admin/leads/emails")) {
      return CurrentPageType.emails;
    }
    if (pathname.includes("/admin/leads/ab-testing")) {
      return CurrentPageType.abTesting;
    }
    if (pathname.includes("/admin/leads/campaign-starter")) {
      return CurrentPageType.campaignStarter;
    }
    return CurrentPageType.stats; // Default to stats for /admin/leads
  };

  const currentPage = getCurrentPage();

  return (
    <Div className="space-y-6">
      {/* Header with Navigation */}
      <Div className="flex flex-col space-y-4">
        <Div>
          <H1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("app.admin.leads.leads.admin.title")}
          </H1>
        </Div>

        <LeadsNavigation locale={locale} currentPage={currentPage} />
      </Div>

      {/* Import Status Alert */}
      <ImportStatusAlert />

      {/* Page Content */}
      {children}
    </Div>
  );
}
