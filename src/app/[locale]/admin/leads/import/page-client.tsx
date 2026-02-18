/**
 * Leads Import Page Client
 * Uses EndpointsPage for import and status
 */

"use client";

import type { JSX } from "react";

import leadsImportEndpoints from "@/app/api/[locale]/leads/import/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsImportPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function LeadsImportPageClient({
  locale,
  user,
}: LeadsImportPageClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsImportEndpoints}
      locale={locale}
      user={user}
    />
  );
}
