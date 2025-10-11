/**
 * IMAP Overview Admin Page
 * Overview dashboard for IMAP server monitoring and management
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapOverviewDashboard } from "../_components/imap-overview-dashboard";

interface ImapOverviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Overview Page Component
 */
export default async function ImapOverviewPage({
  params,
}: ImapOverviewPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("imap.admin.overview.title")}</h1>
        <p className="text-muted-foreground">
          {t("imap.admin.overview.description")}
        </p>
      </div>

      <ImapOverviewDashboard />
    </div>
  );
}
