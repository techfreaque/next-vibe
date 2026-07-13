import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { saveProviderConfig } from "../repository";
import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user }) =>
      saveProviderConfig(
        user.id,
        "CLEVERREACH",
        {
          cleverreachClientId: data.cleverreachClientId || undefined,
          cleverreachClientSecret: data.cleverreachClientSecret || undefined,
          cleverreachListId: data.cleverreachListId || undefined,
          ...(data.cleverreachFormId
            ? { cleverreachFormId: data.cleverreachFormId }
            : {}),
          ...(data.cleverreachSource
            ? { cleverreachSource: data.cleverreachSource }
            : {}),
        },
        {
          listId: data.cleverreachListId,
          headline: data.headline ?? null,
          buttonText: data.buttonText ?? null,
          isActive: data.isActive ?? true,
        },
      ),
  },
});
