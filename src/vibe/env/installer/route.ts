/**
 * Visual Installer Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import endpoints from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) =>
      (await import("./repository")).InstallerRepository.getStatus(logger, t),
  },
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).InstallerRepository.runAction(
        data,
        logger,
        t,
      ),
  },
});
