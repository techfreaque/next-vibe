/**
 * Create SMTP Account Page
 * Page for creating new SMTP accounts
 */

import { Div, P } from "next-vibe-ui/ui";
import { H1 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CreateSmtpAccountForm } from "./_components/create-smtp-account-form";

export default async function CreateSmtpAccountPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="space-y-6">
      {/* Page Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.emails.smtp.admin.create.title")}
        </H1>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.smtp.admin.create.description")}
        </P>
      </Div>

      {/* Form Component */}
      <CreateSmtpAccountForm locale={locale} />
    </Div>
  );
}
