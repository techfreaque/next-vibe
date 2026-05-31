/**
 * User Address by ID Route Handlers
 * PATCH - update an address
 * DELETE - remove an address
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
