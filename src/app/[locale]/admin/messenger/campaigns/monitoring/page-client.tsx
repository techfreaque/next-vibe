"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import campaignStatsDefinition from "@/app/api/[locale]/leads/campaigns/stats/definition";
import cronDashboardDefinitions from "@/app/api/[locale]/system/unified-interface/tasks/cron/dashboard/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function EmailCampaignsMonitoringPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-6">
      {/* Campaign email performance stats */}
      <EndpointsPage
        endpoint={campaignStatsDefinition}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            queryOptions: {
              enabled: true,
              refetchInterval: 60 * 1000,
              staleTime: 30 * 1000,
            },
          },
        }}
      />

      {/* Cron task health for the 3 campaign tasks */}
      <Div className="border-t pt-4">
        <EndpointsPage
          endpoint={cronDashboardDefinitions}
          locale={locale}
          user={user}
          endpointOptions={{
            read: {
              queryOptions: {
                enabled: true,
                refetchInterval: 30 * 1000,
                staleTime: 15 * 1000,
              },
            },
          }}
        />
      </Div>
    </Div>
  );
}
