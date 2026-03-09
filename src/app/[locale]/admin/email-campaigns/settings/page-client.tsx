/**
 * Campaign Starter Settings Admin Page Client
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { H2 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import campaignStarterConfigDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/campaign-starter-config/definition";
import campaignStarterDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/definition";
import haltAllDefinitions from "@/app/api/[locale]/leads/campaigns/halt-all/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CampaignStarterPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignStarterPageClient({
  locale,
  user,
}: CampaignStarterPageClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex flex-col gap-8 w-full">
      {/* Campaign Config */}
      <EndpointsPage
        endpoint={campaignStarterConfigDefinitions}
        locale={locale}
        user={user}
        forceMethod="PUT"
        endpointOptions={{
          read: {
            queryOptions: {
              enabled: true,
              staleTime: 5 * 60 * 1000,
            },
          },
        }}
      />

      {/* Manual Controls */}
      <Div className="flex flex-col gap-4">
        <H2 className="text-lg font-semibold">{t("manualControls")}</H2>

        <EndpointsPage
          endpoint={campaignStarterDefinitions}
          locale={locale}
          user={user}
        />

        <EndpointsPage
          endpoint={haltAllDefinitions}
          locale={locale}
          user={user}
        />
      </Div>
    </Div>
  );
}
