/**
 * IMAP Configuration API Route Handler
 * Handles GET and PUT requests for IMAP configuration management
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { imapConfigRepository as repository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger }) => repository.getConfig(logger),
  },
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      repository.updateConfig(data, logger),
  },
});
