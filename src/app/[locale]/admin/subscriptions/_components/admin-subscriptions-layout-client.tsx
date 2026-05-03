/**
 * Admin Subscriptions Layout Client Component
 * Client-side layout that determines current page from pathname
 */

"use client";

import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Div } from "next-vibe-ui/ui/div";
import type React from "react";
import type { ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { SubscriptionsNavigation } from "./subscriptions-navigation";

interface AdminSubscriptionsLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

export enum CurrentPageType {
  stats = "stats",
  list = "list",
  purchases = "purchases",
  referrals = "referrals",
}

export function AdminSubscriptionsLayoutClient({
  children,
  locale,
}: AdminSubscriptionsLayoutClientProps): React.JSX.Element {
  const pathname = usePathname();

  // Determine current page from pathname
  const getCurrentPage = (): CurrentPageType => {
    if (pathname.includes("/admin/subscriptions/list")) {
      return CurrentPageType.list;
    }
    if (pathname.includes("/admin/subscriptions/purchases")) {
      return CurrentPageType.purchases;
    }
    if (pathname.includes("/admin/subscriptions/referrals")) {
      return CurrentPageType.referrals;
    }
    return CurrentPageType.stats;
  };

  const currentPage = getCurrentPage();

  return (
    <Div className="flex flex-col gap-6">
      {/* Header with Navigation */}
      <Div className="flex flex-col gap-4">
        <SubscriptionsNavigation locale={locale} currentPage={currentPage} />
      </Div>

      {/* Page Content */}
      {children}
    </Div>
  );
}
