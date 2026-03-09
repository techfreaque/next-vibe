/**
 * Lead Detail Page Client Component
 * Uses EndpointsPage with GET endpoint for lead viewing
 */

"use client";

import type { JSX } from "react";

import leadSingleDefinitions from "@/app/api/[locale]/leads/lead/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadDetailPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  leadId: string;
}

export function LeadDetailPageClient({
  locale,
  user,
  leadId,
}: LeadDetailPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadSingleDefinitions}
      locale={locale}
      user={user}
      forceMethod="GET"
      endpointOptions={{
        read: {
          urlPathParams: { id: leadId },
          queryOptions: {
            enabled: true,
            staleTime: 30 * 1000,
          },
        },
        update: {
          urlPathParams: { id: leadId },
        },
        delete: {
          urlPathParams: { id: leadId },
        },
      }}
    />
  );
}
