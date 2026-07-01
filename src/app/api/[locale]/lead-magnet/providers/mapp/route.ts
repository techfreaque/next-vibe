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
        "MAPP",
        {
          mappUsername: data.mappUsername || undefined,
          mappPassword: data.mappPassword || undefined,
          mappDomain: data.mappDomain || undefined,
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
