/**
 * Catalog Product Update API Route Handler
 * Handles PATCH requests to update catalog product fields
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
