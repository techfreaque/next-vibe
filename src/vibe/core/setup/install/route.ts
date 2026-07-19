/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import installEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: installEndpoints,
  [Methods.POST]: {
    handler: async ({ user, t, logger }) =>
      // Dynamic import prevents Turbopack NFT from statically tracing process.cwd()
      // and filesystem calls in repository.ts during production builds.
      (await import("./repository")).SetupInstallRepository.installCli(
        user,
        t,
        logger,
      ),
  },
});
