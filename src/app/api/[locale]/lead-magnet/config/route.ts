/**
 * Lead Magnet Config Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
