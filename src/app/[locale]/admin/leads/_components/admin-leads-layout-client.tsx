/**
 * Admin Leads Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Div } from "next-vibe-ui/ui/div";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsNavigation } from "./leads-navigation";

interface AdminLeadsLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

export enum CurrentPageType {
  import = "import",
  stats = "stats",
  list = "list",
}

export function AdminLeadsLayoutClient({
  children,
  locale,
}: AdminLeadsLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();

  // Determine current page from pathname
  const getCurrentPage = (): CurrentPageType => {
    if (pathname.includes("/admin/leads/import")) {
      return CurrentPageType.import;
    }
    if (pathname.includes("/admin/leads/list")) {
      return CurrentPageType.list;
    }
    return CurrentPageType.stats; // Default to stats for /admin/leads
  };

  const currentPage = getCurrentPage();

  return (
    <Div className="flex flex-col gap-6">
      {/* Header with Navigation */}
      <Div className="flex flex-col gap-4">
        <LeadsNavigation locale={locale} currentPage={currentPage} />
      </Div>

      {/* Page Content */}
      {children}
    </Div>
  );
}
