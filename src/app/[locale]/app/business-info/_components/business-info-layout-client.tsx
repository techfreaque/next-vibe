/**
 * Business Info Layout Client Component
 * Conditionally renders sidebar based on current route
 */

"use client";

import { usePathname } from "next/navigation";
import { Container } from "next-vibe-ui/ui/container";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BusinessInfoSidebarClient } from "./business-info-sidebar-client";
import { OverallProgressClient } from "./overall-progress-client";

interface BusinessInfoLayoutClientProps {
  children: ReactNode;
  locale: CountryLanguage;
}

export function BusinessInfoLayoutClient({
  children,
  locale,
}: BusinessInfoLayoutClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const pathname = usePathname();

  // Check if we're on the main business-info overview page
  const isOverviewPage = pathname === `/${locale}/app/business-info`;

  // If we're on the overview page, don't show the sidebar
  if (isOverviewPage) {
    return (
      <Container size="2xl" className="py-8">
        <div className="space-y-6">{children}</div>
      </Container>
    );
  }

  // For sub-pages, show the sidebar layout
  return (
    <Container size="2xl" className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {t("businessInfo.nav.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("businessInfo.nav.description")}
              </p>
            </div>

            {/* Overall Progress */}
            <OverallProgressClient locale={locale} />

            {/* Navigation Items */}
            <BusinessInfoSidebarClient locale={locale} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </Container>
  );
}
