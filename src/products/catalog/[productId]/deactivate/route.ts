/**
 * Catalog Product Deactivate API Route Handler
 * Handles POST requests to soft-delete a catalog product
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CatalogDeactivateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, logger, user, locale }) =>
      CatalogDeactivateRepository.deactivateProduct(
        urlPathParams.productId,
        user.id,
        logger,
        locale,
      ),
  },
});
