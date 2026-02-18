/**
 * Lead Edit Page Client Component
 * Uses EndpointsPage with PATCH endpoint for lead editing
 */

"use client";

import type { JSX } from "react";

import leadSingleDefinitions from "@/app/api/[locale]/leads/lead/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadEditPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  leadId: string;
}

export function LeadEditPageClient({
  locale,
  user,
  leadId,
}: LeadEditPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadSingleDefinitions}
      locale={locale}
      user={user}
      forceMethod="PATCH"
      endpointOptions={{
        update: {
          urlPathParams: { id: leadId },
        },
        read: {
          urlPathParams: { id: leadId },
          queryOptions: {
            enabled: true,
            staleTime: 30 * 1000,
          },
        },
      }}
    />
  );
}
