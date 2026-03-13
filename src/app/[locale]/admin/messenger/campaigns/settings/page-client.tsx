/**
 * Campaign Settings Admin Page Client
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import bounceProcessorConfigDefinitions from "@/app/api/[locale]/leads/campaigns/bounce-processor/bounce-processor-config/definition";
import campaignStarterConfigDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/campaign-starter-config/definition";
import emailCampaignsConfigDefinitions from "@/app/api/[locale]/leads/campaigns/email-campaigns/email-campaigns-config/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CampaignStarterPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

const readOptions = {
  read: {
    queryOptions: {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    },
  },
} as const;

export function CampaignStarterPageClient({
  locale,
  user,
}: CampaignStarterPageClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-8 w-full">
      <Tabs defaultValue="campaign-starter" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaign-starter">
            {t("tabs.campaignStarter")}
          </TabsTrigger>
          <TabsTrigger value="email-campaigns">
            {t("tabs.emailCampaigns")}
          </TabsTrigger>
          <TabsTrigger value="bounce-processor">
            {t("tabs.bounceProcessor")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaign-starter">
          <EndpointsPage
            endpoint={campaignStarterConfigDefinitions}
            locale={locale}
            user={user}
            forceMethod="PUT"
            endpointOptions={readOptions}
          />
        </TabsContent>

        <TabsContent value="email-campaigns">
          <EndpointsPage
            endpoint={emailCampaignsConfigDefinitions}
            locale={locale}
            user={user}
            forceMethod="PUT"
            endpointOptions={readOptions}
          />
        </TabsContent>

        <TabsContent value="bounce-processor">
          <EndpointsPage
            endpoint={bounceProcessorConfigDefinitions}
            locale={locale}
            user={user}
            forceMethod="PUT"
            endpointOptions={readOptions}
          />
        </TabsContent>
      </Tabs>
    </Div>
  );
}
