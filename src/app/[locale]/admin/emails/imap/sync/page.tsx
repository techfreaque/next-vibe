/**
 * IMAP Sync Admin Page
 * Page for monitoring and managing email synchronization operations
 */

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
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("imap.admin.sync.title")}</h1>
        <p className="text-muted-foreground">
          {t("imap.admin.sync.description")}
        </p>
      </div>

      <ImapSyncOperations />
    </div>
  );
}
