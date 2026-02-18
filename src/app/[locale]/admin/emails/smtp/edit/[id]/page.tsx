import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SmtpEditPageClient } from "./page-client";

export default async function SmtpEditPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage; id: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/emails/smtp/edit`,
  );
  return <SmtpEditPageClient locale={locale} user={user} />;
}
