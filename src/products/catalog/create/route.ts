/**
 * Catalog Product Create API Route Handler
 * Handles POST requests to create a new catalog product
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CatalogCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, user, locale }) =>
      CatalogCreateRepository.createProduct(data, logger, user.id, locale),
  },
});
