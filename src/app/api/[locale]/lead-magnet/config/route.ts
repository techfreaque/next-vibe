/**
 * Lead Magnet Config Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { LeadMagnetConfigRepository } from "./repository";

export const { GET, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ user }) => LeadMagnetConfigRepository.getConfig(user.id),
  },
  [Methods.DELETE]: {
    handler: ({ user }) => LeadMagnetConfigRepository.deleteConfig(user.id),
  },
});
