/**
 * User Address by ID Route Handlers
 * PATCH - update an address
 * DELETE - remove an address
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import userAddressByIdEndpoints from "./definition";
import { UserAddressByIdRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: userAddressByIdEndpoints,
  [Methods.PATCH]: {
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      UserAddressByIdRepository.updateAddress(
        data,
        urlPathParams.addressId,
        user,
        locale,
        logger,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, user, locale, logger }) =>
      UserAddressByIdRepository.deleteAddress(
        urlPathParams.addressId,
        user,
        locale,
        logger,
      ),
  },
});
