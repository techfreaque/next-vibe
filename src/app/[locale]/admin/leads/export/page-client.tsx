/**
 * Leads Export Page Client Component
 * Uses EndpointsPage with POST endpoint for leads export
 */

"use client";

import type { JSX } from "react";

import leadsExportDefinitions from "@/app/api/[locale]/leads/export/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsExportPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsExportPageClient({
  locale,
  user,
}: LeadsExportPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsExportDefinitions}
      locale={locale}
      user={user}
    />
  );
}
