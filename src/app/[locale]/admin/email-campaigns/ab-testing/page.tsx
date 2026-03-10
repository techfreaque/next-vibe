/**
 * A/B Testing Settings Page
 * Configure and monitor A/B testing for email campaigns
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { ABTestingClient } from "./ab-testing-client";

interface ABTestingPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function ABTestingPage({
  params,
}: ABTestingPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/email-campaigns/ab-testing`,
  );

  return <ABTestingClient locale={locale} user={user} />;
}
