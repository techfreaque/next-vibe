/**
 * Catalog Product List API Route Handler
 * Handles GET requests to list catalog products
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CatalogListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, user, locale }) =>
      CatalogListRepository.listProducts(data, logger, user.id, locale),
  },
});
