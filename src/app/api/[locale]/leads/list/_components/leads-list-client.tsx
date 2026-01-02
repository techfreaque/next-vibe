/**
 * Leads List Client Component
 * Minimal wrapper - all configuration is in the endpoint definition
 */

"use client";

import type React from "react";

import { LeadSortField, SortOrder } from "@/app/api/[locale]/leads/enum";
import leadsListEndpoints from "@/app/api/[locale]/leads/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadsListClientProps {
  locale: CountryLanguage;
}

export function LeadsListClient({ locale }: LeadsListClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={leadsListEndpoints}
      locale={locale}
      endpointOptions={{
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 1 * 60 * 1000, // 1 minute
        },
        filterOptions: {
          initialFilters: {
            sortingOptions: {
              sortBy: LeadSortField.CREATED_AT,
              sortOrder: SortOrder.DESC,
            },
            paginationInfo: {
              page: 1,
              limit: 20,
            },
          },
        },
      }}
    />
  );
}
