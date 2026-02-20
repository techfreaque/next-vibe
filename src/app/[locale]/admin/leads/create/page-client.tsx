/**
 * Lead Create Page Client Component
 * Uses EndpointsPage with POST endpoint for lead creation
 */

"use client";

import type { JSX } from "react";

import leadsCreateDefinitions from "@/app/api/[locale]/leads/create/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadCreatePageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadCreatePageClient({
  locale,
  user,
}: LeadCreatePageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsCreateDefinitions}
      locale={locale}
      user={user}
    />
  );
}
