/**
 * Edit SMTP Account Page
 * Page for editing existing SMTP accounts
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EditSmtpAccountForm } from "@/app/api/[locale]/v1/core/emails/smtp-client/edit/_components/edit-smtp-account-form";

export default async function EditSmtpAccountPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Page Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.emails.smtp.pages.edit.edit")}
        </H1>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.smtp.pages.edit.editDescription")}
        </P>
      </Div>

      {/* Form Component */}
      <EditSmtpAccountForm locale={locale} accountId={id} />
    </Div>
  );
}
