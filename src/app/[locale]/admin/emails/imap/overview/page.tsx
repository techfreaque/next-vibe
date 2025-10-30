/**
 * IMAP Overview Admin Page
 * Overview dashboard for IMAP server monitoring and management
 */

import { Div, P } from "next-vibe-ui/ui";
import { H1 } from "next-vibe-ui/ui/typography";
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
    <Div className="container mx-auto py-6 space-y-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.overview.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.overview.description")}
        </P>
      </Div>

      <ImapOverviewDashboard />
    </Div>
  );
}
