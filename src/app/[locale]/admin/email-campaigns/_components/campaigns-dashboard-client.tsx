/**
 * Campaigns Dashboard Client
 * Renders the campaign stats endpoint widget with quick actions
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import type React from "react";

import campaignStarterDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/definition";
import haltAllDefinitions from "@/app/api/[locale]/leads/campaigns/halt-all/definition";
import campaignStatsEndpoints from "@/app/api/[locale]/leads/campaigns/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CampaignsDashboardClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignsDashboardClient({
  locale,
  user,
}: CampaignsDashboardClientProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Stats dashboard */}
      <EndpointsPage
        endpoint={campaignStatsEndpoints}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            queryOptions: {
              enabled: true,
              refetchOnWindowFocus: false,
              staleTime: 5 * 60 * 1000,
            },
          },
        }}
      />

      {/* Quick actions */}
      <Div className="flex flex-col gap-4">
        <H3 className="text-lg font-semibold">{t("quickActions")}</H3>
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EndpointsPage
            endpoint={campaignStarterDefinitions}
            locale={locale}
            user={user}
          />
          <EndpointsPage
            endpoint={haltAllDefinitions}
            locale={locale}
            user={user}
          />
        </Div>
      </Div>
    </Div>
  );
}
