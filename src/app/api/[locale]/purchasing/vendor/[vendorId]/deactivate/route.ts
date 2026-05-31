/**
 * Vendor Deactivate Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { VendorDeactivateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VendorDeactivateRepository.deactivateVendor(
        urlPathParams.vendorId,
        user.id,
        logger,
        locale,
      ),
  },
});
