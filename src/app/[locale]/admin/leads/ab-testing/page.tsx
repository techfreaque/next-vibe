/**
 * A/B Testing Settings Page
 * Configure and monitor A/B testing for email campaigns
 */

import type React from "react";
import { Div, P } from "next-vibe-ui/ui";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const { t } = simpleT(locale);

  return (
    <Div className="space-y-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.admin.tabs.abTesting_description")}
        </P>
      </Div>

      {/* A/B Testing Client Component */}
      <ABTestingClient locale={locale} />
    </Div>
  );
}
