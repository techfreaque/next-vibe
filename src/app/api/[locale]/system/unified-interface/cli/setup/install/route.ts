/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import installEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: installEndpoints,
  [Methods.POST]: {
    handler: async ({ data, user, t }) =>
      // Dynamic import prevents Turbopack NFT from statically tracing process.cwd()
      // and filesystem calls in repository.ts during production builds.
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).SetupInstallRepository.installCli(data, user, t),
  },
});
