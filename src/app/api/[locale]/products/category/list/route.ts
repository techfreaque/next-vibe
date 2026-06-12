/**
 * Product Category List API Route Handler
 * Handles GET requests to list product categories
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CategoryListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, user, locale }) =>
      CategoryListRepository.listCategories(data, logger, user.id, locale),
  },
});
