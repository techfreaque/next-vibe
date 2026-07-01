/**
 * Catalog Product Update API Route Handler
 * Handles PATCH requests to update catalog product fields
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CatalogUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, logger, user, locale }) =>
      CatalogUpdateRepository.updateProduct(
        urlPathParams.productId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
