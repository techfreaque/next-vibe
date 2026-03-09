/**
 * Lead Delete Page Client Component
 * Uses EndpointsPage with DELETE endpoint for lead deletion
 */

"use client";

import type { JSX } from "react";

import leadSingleDefinitions from "@/app/api/[locale]/leads/lead/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadDeletePageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  leadId: string;
}

export function LeadDeletePageClient({
  locale,
  user,
  leadId,
}: LeadDeletePageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadSingleDefinitions}
      locale={locale}
      user={user}
      forceMethod="DELETE"
      endpointOptions={{
        read: {
          urlPathParams: { id: leadId },
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
