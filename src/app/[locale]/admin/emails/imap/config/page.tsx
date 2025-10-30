/**
 * IMAP Configuration Admin Page
 * Page for managing IMAP server configuration
 */

import { Div, P } from "next-vibe-ui/ui";
import { H1 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapConfigurationManagement } from "../_components/imap-configuration-management";

interface ImapConfigPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Configuration Page Component
 */
export default async function ImapConfigPage({
  params,
}: ImapConfigPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="container mx-auto py-6 space-y-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.config.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.config.description")}
        </P>
      </Div>

      <ImapConfigurationManagement locale={locale} />
    </Div>
  );
}
