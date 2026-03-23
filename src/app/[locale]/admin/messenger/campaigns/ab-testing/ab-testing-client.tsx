/**
 * A/B Testing Client Component
 * Displays live journey variant data with editing capabilities
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import journeyVariantsEndpoints from "@/app/api/[locale]/leads/campaigns/journey-variants/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../_components/i18n";

interface ABTestingClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function ABTestingClient({
  locale,
  user,
}: ABTestingClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Description */}
      <P className="text-muted-foreground">{t("abTest.subtitle")}</P>

      {/* Journey Variants - live data with GET/POST/PATCH */}
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
    </Div>
  );
}
