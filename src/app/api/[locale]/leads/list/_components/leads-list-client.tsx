/**
 * Leads List Client Component
 * Minimal wrapper - all configuration is in the endpoint definition
 */

"use client";

import type React from "react";

import leadsListEndpoints from "@/app/api/[locale]/leads/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsListClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsListClient({
  locale,
  user,
}: LeadsListClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsListEndpoints}
      locale={locale}
      user={user}
      endpointOptions={{
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 1 * 60 * 1000, // 1 minute
        },
      }}
    />
  );
}
