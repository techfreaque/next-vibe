/**
 * Campaign Starter Settings Admin Page
 * Interface for managing campaign starter configuration
 */

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { CampaignStarterForm } from "@/app/api/[locale]/leads/campaigns/campaign-starter/_components/campaign-starter-form";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    <Div className="flex flex-col gap-6">
      {/* Page Description */}
      <Div>
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.admin.leads.leads.admin.campaignStarter.description")}
        </P>
      </Div>

      {/* Campaign Starter Settings Client Component */}
      <CampaignStarterForm locale={locale} />
    </Div>
  );
}
