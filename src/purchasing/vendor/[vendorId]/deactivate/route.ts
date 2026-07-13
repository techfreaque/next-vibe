/**
 * Vendor Deactivate Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
