/**
 * Campaigns Dashboard Client
 * Renders the campaign stats endpoint widget
 */

"use client";

import type React from "react";

import campaignStatsEndpoints from "@/app/api/[locale]/leads/campaigns/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface CampaignsDashboardClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignsDashboardClient({
  locale,
  user,
}: CampaignsDashboardClientProps): React.JSX.Element {
  return (
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
  );
}
