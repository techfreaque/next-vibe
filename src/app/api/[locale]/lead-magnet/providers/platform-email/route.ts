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
        "PLATFORM_EMAIL",
        {
          notifyEmail: data.notifyEmail || undefined,
          notifyEmailName: data.notifyEmailName || undefined,
        },
        {
          listId: null,
          headline: data.headline ?? null,
          buttonText: data.buttonText ?? null,
          isActive: data.isActive ?? true,
        },
      ),
  },
});
