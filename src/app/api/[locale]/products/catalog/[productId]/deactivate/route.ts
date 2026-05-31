/**
 * Catalog Product Deactivate API Route Handler
 * Handles POST requests to soft-delete a catalog product
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
