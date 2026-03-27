export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsEmailPreviewPageProps {
  params: Promise<{
    locale: CountryLanguage;
    journeyVariant: string;
    stage: string;
  }>;
}

export interface LeadsEmailPreviewPageData {
  locale: CountryLanguage;
  journeyVariant: string;
  stage: string;
}

export async function tanstackLoader({
  params,
}: LeadsEmailPreviewPageProps): Promise<never> {
  const { locale, journeyVariant, stage } = await params;
  await requireAdminUser(
    locale,
    `/${locale}/admin/leads/emails/${journeyVariant}/${stage}`,
  );
  redirect(
    `/${locale}/admin/messenger/campaigns/journeys/${journeyVariant}/${stage}`,
  );
}

export function TanstackPage(): never {
  return null as never;
}

export default async function LeadsEmailPreviewPage({
  params,
}: LeadsEmailPreviewPageProps): Promise<React.JSX.Element> {
  return tanstackLoader({ params }) as never;
}
