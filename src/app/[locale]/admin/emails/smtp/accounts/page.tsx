/**
 * SMTP Accounts Page
 * Page for managing SMTP accounts without navigation (handled by layout)
 */

import type { JSX } from "react";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SmtpAccountsClient } from "./_components/smtp-accounts-client";

export default async function SmtpAccountsPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.smtp.list.description")}
        </P>
      </Div>

      {/* Client Component handles all interactions */}
      <SmtpAccountsClient locale={locale} />
    </Div>
  );
}
