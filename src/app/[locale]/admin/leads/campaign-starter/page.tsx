import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsCampaignStarterPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface LeadsCampaignStarterPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: LeadsCampaignStarterPageProps): Promise<never> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads/campaign-starter`);
  redirect(`/${locale}/admin/messenger/campaigns`);
}

// oxlint-disable-next-line no-unused-vars
export function TanstackPage(_props: LeadsCampaignStarterPageData): never {
  redirect("/");
}

export default async function LeadsCampaignStarterPage({
  params,
}: LeadsCampaignStarterPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
