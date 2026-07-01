import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import serveDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: serveDefinition,
  [Methods.POST]: {
    handler: async ({ logger, locale, user }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).MCPServeRepository.startServer(logger, locale, user),
  },
});
