/**
 * Campaign Starter Settings Admin Page
 * Interface for managing campaign starter configuration
 */

import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CampaignStarterForm } from "./_components/campaign-starter-form";

interface AdminCampaignStarterPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminCampaignStarterPage({
  params,
}: AdminCampaignStarterPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("leads.admin.campaignStarter.description")}
        </p>
      </div>

      {/* Campaign Starter Settings Client Component */}
      <CampaignStarterForm locale={locale} />
    </div>
  );
}
