import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import serveDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: serveDefinition,
  [Methods.POST]: {
    handler: async ({ logger, locale, user }) =>
      (await import("./repository")).MCPServeRepository.startServer(
        logger,
        locale,
        user,
      ),
  },
});
