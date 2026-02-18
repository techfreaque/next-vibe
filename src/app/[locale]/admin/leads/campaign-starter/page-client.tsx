/**
 * Campaign Starter Settings Admin Page Client
 */

"use client";

import type { JSX } from "react";

import campaignStarterDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/campaign-starter-config/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface CampaignStarterPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignStarterPageClient({
  locale,
  user,
}: CampaignStarterPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={campaignStarterDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: {
            enabled: true,
            staleTime: 5 * 60 * 1000,
          },
        },
      }}
    />
  );
}
