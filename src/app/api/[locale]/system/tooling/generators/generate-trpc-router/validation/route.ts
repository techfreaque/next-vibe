/**
 * TRPC Integration Validation Route
 * HTTP endpoint for TRPC integration validation operations
 * Optional route - only created because validation HTTP access is useful for development
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).TRPCValidationRepository.executeValidationOperation(data, logger, t),
  },
});
