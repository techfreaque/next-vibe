/**
 * Product Category Create API Route Handler
 * Handles POST requests to create a new product category
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CategoryCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, user, locale }) =>
      CategoryCreateRepository.createCategory(data, logger, user.id, locale),
  },
});
