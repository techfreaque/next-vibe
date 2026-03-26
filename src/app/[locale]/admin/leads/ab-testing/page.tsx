import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsABTestingPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface LeadsABTestingPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: LeadsABTestingPageProps): Promise<never> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/leads/ab-testing`);
  redirect(`/${locale}/admin/messenger/campaigns/ab-testing`);
}

export function TanstackPage(): never {
  return null as never;
}

export default async function LeadsABTestingPage({
  params,
}: LeadsABTestingPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
