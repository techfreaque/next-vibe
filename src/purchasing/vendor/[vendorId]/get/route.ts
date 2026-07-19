/**
 * Vendor Get Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { VendorGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VendorGetRepository.getVendor(
        urlPathParams.vendorId,
        user.id,
        logger,
        locale,
      ),
  },
});
