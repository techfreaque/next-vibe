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
        "SALESMANAGO",
        {
          salesManagoClientId: data.salesManagoClientId || undefined,
          salesManagoApiKey: data.salesManagoApiKey || undefined,
          salesManagoSha: data.salesManagoSha || undefined,
          salesManagoDomain: data.salesManagoDomain || undefined,
          salesManagoOwner: data.salesManagoOwner || undefined,
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
