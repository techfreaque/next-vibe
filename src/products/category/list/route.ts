/**
 * Product Category List API Route Handler
 * Handles GET requests to list product categories
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CategoryListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, user, locale }) =>
      CategoryListRepository.listCategories(data, logger, user.id, locale),
  },
});
