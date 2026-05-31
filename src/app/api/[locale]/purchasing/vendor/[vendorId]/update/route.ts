/**
 * Vendor Update Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { VendorUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      VendorUpdateRepository.updateVendor(
        urlPathParams.vendorId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
