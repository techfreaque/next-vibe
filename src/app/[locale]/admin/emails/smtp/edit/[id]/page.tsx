/**
 * Edit SMTP Account Page
 * Page for editing existing SMTP accounts
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EditSmtpAccountForm } from "./_components/edit-smtp-account-form";

export default async function EditSmtpAccountPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.emails.smtp.pages.edit.edit")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.smtp.pages.edit.editDescription")}
        </p>
      </div>

      {/* Form Component */}
      <EditSmtpAccountForm locale={locale} accountId={id} />
    </div>
  );
}
