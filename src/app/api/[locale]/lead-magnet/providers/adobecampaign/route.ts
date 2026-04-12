import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { saveProviderConfig } from "../repository";
import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user }) =>
      saveProviderConfig(
        user.id,
        "ADOBECAMPAIGN",
        {
          adobeCampaignOrganizationId:
            data.adobeCampaignOrganizationId || undefined,
          adobeCampaignClientId: data.adobeCampaignClientId || undefined,
          adobeCampaignClientSecret:
            data.adobeCampaignClientSecret || undefined,
          adobeCampaignApiKey: data.adobeCampaignApiKey || undefined,
          adobeCampaignListId: data.adobeCampaignListId || undefined,
        },
        {
          listId: data.listId ?? null,
          headline: data.headline ?? null,
          buttonText: data.buttonText ?? null,
          isActive: data.isActive ?? true,
        },
      ),
  },
});
