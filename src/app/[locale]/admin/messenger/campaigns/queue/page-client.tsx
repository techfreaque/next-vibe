/**
 * Campaign Queue Client
 * Renders the campaign queue endpoint widget
 */

"use client";

import type React from "react";

import campaignQueueEndpoints from "@/app/api/[locale]/leads/campaigns/queue/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface CampaignQueueClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignQueueClient({
  locale,
  user,
}: CampaignQueueClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={campaignQueueEndpoints}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: {
            enabled: true,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
          },
        },
      }}
    />
  );
}
