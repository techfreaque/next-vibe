/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { Methods } from "../../definition/enums";
import { endpointsHandler } from "../../route/multi";
import installEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: installEndpoints,
  [Methods.POST]: {
    handler: async ({ user, logger }) =>
      // Dynamic import prevents Turbopack NFT from statically tracing process.cwd()
      // and filesystem calls in repository.ts during production builds.
      (await import("./repository")).SetupInstallRepository.installCli(
        user,
        logger,
      ),
  },
});
