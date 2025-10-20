/**
 * IMAP Folders Admin Page
 * Page for managing IMAP folders and monitoring sync status
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapFoldersManagement } from "../_components/imap-folders-management";

interface ImapFoldersPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Folders Page Component
 */
export default async function ImapFoldersPage({
  params,
}: ImapFoldersPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.folders.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.folders.description")}
        </p>
      </div>

      <ImapFoldersManagement />
    </div>
  );
}
