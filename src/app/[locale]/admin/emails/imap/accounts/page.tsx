/**
 * IMAP Accounts Admin Page
 * Page for managing IMAP accounts
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ImapAccountsManagement } from "../_components/imap-accounts-management";

interface ImapAccountsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * IMAP Accounts Page Component
 */
export default async function ImapAccountsPage({
  params,
}: ImapAccountsPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("imap.admin.accounts.title")}</h1>
        <p className="text-muted-foreground">
          {t("imap.admin.accounts.description")}
        </p>
      </div>

      <ImapAccountsManagement />
    </div>
  );
}
