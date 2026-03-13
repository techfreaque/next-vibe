/**
 * Campaigns Dashboard Client
 * Renders the campaign stats endpoint widget with quick actions
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type React from "react";

import bounceProcessorDefinitions from "@/app/api/[locale]/leads/campaigns/bounce-processor/definition";
import campaignStarterDefinitions from "@/app/api/[locale]/leads/campaigns/campaign-starter/definition";
import emailCampaignsDefinitions from "@/app/api/[locale]/leads/campaigns/email-campaigns/definition";
import haltAllDefinitions from "@/app/api/[locale]/leads/campaigns/halt-all/definition";
import campaignStatsEndpoints from "@/app/api/[locale]/leads/campaigns/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CampaignsDashboardClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CampaignsDashboardClient({
  locale,
  user,
}: CampaignsDashboardClientProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-6">
      {/* Stats dashboard */}
      <EndpointsPage
        endpoint={campaignStatsEndpoints}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            queryOptions: {
              enabled: true,
              refetchOnWindowFocus: false,
              staleTime: 5 * 60 * 1000,
            },
          },
        }}
      />

      {/* Quick actions */}
      <Div className="flex flex-col gap-4">
        <H3 className="text-lg font-semibold">{t("quickActions")}</H3>
        <Tabs defaultValue="campaign-starter" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaign-starter">
              {t("quickActionTabs.campaignStarter")}
            </TabsTrigger>
            <TabsTrigger value="email-campaigns">
              {t("quickActionTabs.emailCampaigns")}
            </TabsTrigger>
            <TabsTrigger value="bounce-processor">
              {t("quickActionTabs.bounceProcessor")}
            </TabsTrigger>
            <TabsTrigger value="halt-all">
              {t("quickActionTabs.haltAll")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaign-starter">
            <EndpointsPage
              endpoint={campaignStarterDefinitions}
              locale={locale}
              user={user}
            />
          </TabsContent>

          <TabsContent value="email-campaigns">
            <EndpointsPage
              endpoint={emailCampaignsDefinitions}
              locale={locale}
              user={user}
            />
          </TabsContent>

          <TabsContent value="bounce-processor">
            <EndpointsPage
              endpoint={bounceProcessorDefinitions}
              locale={locale}
              user={user}
            />
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
    </Div>
  );
}
