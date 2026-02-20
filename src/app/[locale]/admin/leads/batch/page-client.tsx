/**
 * Leads Batch Operations Page Client Component
 * Uses EndpointsPage with POST endpoint for batch lead updates
 */

"use client";

import type { JSX } from "react";

import leadsBatchDefinitions from "@/app/api/[locale]/leads/batch/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsBatchPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsBatchPageClient({
  locale,
  user,
}: LeadsBatchPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsBatchDefinitions}
      locale={locale}
      user={user}
    />
  );
}
