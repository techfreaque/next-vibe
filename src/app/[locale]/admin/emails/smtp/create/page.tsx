/**
 * Create SMTP Account Page
 * Page for creating new SMTP accounts
 */

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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.emails.smtp.admin.create.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.smtp.admin.create.description")}
        </p>
      </div>

      {/* Form Component */}
      <CreateSmtpAccountForm locale={locale} />
    </div>
  );
}
