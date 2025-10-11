/**
 * IMAP Configuration API Route Handler
 * Handles GET and PUT requests for IMAP configuration management
 */

import "server-only";

import { endpointsHandler } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
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
