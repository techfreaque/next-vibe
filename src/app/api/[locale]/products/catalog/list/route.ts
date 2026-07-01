/**
 * Catalog Product List API Route Handler
 * Handles GET requests to list catalog products
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CatalogListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, user, locale }) =>
      CatalogListRepository.listProducts(data, logger, user.id, locale),
  },
});
