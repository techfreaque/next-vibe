/**
 * Leads Stats Client Component
 * Minimal wrapper - all configuration is in the endpoint definition
 */

"use client";

import type React from "react";

import statsEndpoints from "@/app/api/[locale]/leads/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsStatsClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsStatsClient({
  locale,
  user,
}: LeadsStatsClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={statsEndpoints}
      locale={locale}
      user={user}
      endpointOptions={{
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      }}
    />
  );
}
