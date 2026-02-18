import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SmtpCreatePageClient } from "./page-client";

export default async function SmtpCreatePage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/emails/smtp/create`,
  );
  return <SmtpCreatePageClient locale={locale} user={user} />;
}
