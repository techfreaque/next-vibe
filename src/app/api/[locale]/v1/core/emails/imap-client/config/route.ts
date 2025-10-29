/**
 * IMAP Configuration API Route Handler
 * Handles GET and PUT requests for IMAP configuration management
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { imapConfigRepository as repository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      repository.getConfig(data, user, locale, logger),
  },
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      repository.updateConfig(data, user, locale, logger),
  },
});
