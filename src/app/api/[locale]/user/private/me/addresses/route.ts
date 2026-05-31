/**
 * User Addresses Route Handlers
 * GET - list all addresses for the authenticated user
 * POST - create a new address
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import userAddressesEndpoints from "./definition";
import { UserAddressesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: userAddressesEndpoints,
  [Methods.GET]: {
    handler: ({ user, locale, logger }) =>
      UserAddressesRepository.listAddresses(user, locale, logger),
  },
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      UserAddressesRepository.createAddress(data, user, locale, logger),
  },
});
