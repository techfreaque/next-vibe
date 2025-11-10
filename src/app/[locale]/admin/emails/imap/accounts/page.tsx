/**
 * IMAP Accounts Admin Page
 * Page for managing IMAP accounts
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
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
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.emails.imap.admin.accounts.title")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.emails.imap.admin.accounts.description")}
        </P>
      </Div>

      <ImapAccountsManagement />
    </Div>
  );
}
