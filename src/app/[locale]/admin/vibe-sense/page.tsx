/**
 * Vibe Sense — Admin Dashboard Page
 * Lists all pipeline graphs visible to the current admin
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeSenseClient } from "./page-client";

export default async function VibeSensePage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/vibe-sense`);

  return <VibeSenseClient locale={locale} user={user} />;
}
