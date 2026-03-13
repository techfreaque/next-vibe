/**
 * Journey Variants Registration Section
 * Client component rendering the journey variant management endpoint widget
 */

"use client";

import type React from "react";

import journeyVariantsEndpoints from "@/app/api/[locale]/leads/campaigns/journey-variants/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface JourneyVariantsClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function JourneyVariantsClient({
  locale,
  user,
}: JourneyVariantsClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={journeyVariantsEndpoints}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: {
            enabled: true,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      }}
    />
  );
}
