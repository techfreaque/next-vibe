/**
 * User Addresses Route Handlers
 * GET - list all addresses for the authenticated user
 * POST - create a new address
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
