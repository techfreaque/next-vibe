/**
 * Campaign Settings Admin Page Client
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import bounceProcessorDefinitions from "@/app/api/[locale]/leads/campaigns/bounce-processor/definition";
import campaignStarterDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/definition";
import emailCampaignsDefinitions from "@/app/api/[locale]/leads/campaigns/email-campaigns/definition";
import haltAllDefinitions from "@/app/api/[locale]/leads/campaigns/halt-all/definition";
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaign-starter">
            {t("tabs.campaignStarter")}
          </TabsTrigger>
          <TabsTrigger value="email-campaigns">
            {t("tabs.emailCampaigns")}
          </TabsTrigger>
          <TabsTrigger value="bounce-processor">
            {t("tabs.bounceProcessor")}
          </TabsTrigger>
          <TabsTrigger value="halt-all">{t("tabs.haltAll")}</TabsTrigger>
        </TabsList>

        <TabsContent value="campaign-starter">
          <Div className="flex flex-col gap-6">
            <EndpointsPage
              endpoint={campaignStarterDefinitions}
              locale={locale}
              user={user}
              forceMethod="POST"
              endpointOptions={readOptions}
            />
          </Div>
        </TabsContent>

        <TabsContent value="email-campaigns">
          <Div className="flex flex-col gap-6">
            <EndpointsPage
              endpoint={emailCampaignsDefinitions}
              locale={locale}
              user={user}
              forceMethod="POST"
              endpointOptions={readOptions}
            />
          </Div>
        </TabsContent>

        <TabsContent value="bounce-processor">
          <Div className="flex flex-col gap-6">
            <EndpointsPage
              endpoint={bounceProcessorDefinitions}
              locale={locale}
              user={user}
              forceMethod="POST"
              endpointOptions={readOptions}
            />
          </Div>
        </TabsContent>

        <TabsContent value="halt-all">
          <EndpointsPage
            endpoint={haltAllDefinitions}
            locale={locale}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </Div>
  );
}
