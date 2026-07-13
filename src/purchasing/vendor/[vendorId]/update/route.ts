/**
 * Vendor Update Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
