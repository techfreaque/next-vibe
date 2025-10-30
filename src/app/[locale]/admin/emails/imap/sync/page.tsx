/**
 * IMAP Sync Admin Page
 * Page for monitoring and managing email synchronization operations
 */

import { Div, P } from "next-vibe-ui/ui";
import { H1 } from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapSyncOperations } from "../_components/imap-sync-operations";

interface ImapSyncPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Sync Page Component
 */
export default async function ImapSyncPage({
  params,
}: ImapSyncPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="container mx-auto py-6 space-y-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.sync.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.sync.description")}
        </P>
      </Div>

      <ImapSyncOperations />
    </Div>
  );
}
