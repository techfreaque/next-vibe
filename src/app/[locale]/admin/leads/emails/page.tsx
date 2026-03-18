import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsEmailsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface LeadsEmailsRedirectPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: LeadsEmailsPageProps): Promise<never> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads/emails`);
  redirect(`/${locale}/admin/messenger/campaigns/journeys`);
}

// oxlint-disable-next-line no-unused-vars
export function TanstackPage(_props: LeadsEmailsRedirectPageData): never {
  redirect("/");
}

export default async function LeadsEmailsPage({
  params,
}: LeadsEmailsPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
