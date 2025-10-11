/**
 * Newsletter Status API Route
 * Get newsletter subscription status for an email
 */

import "server-only";

import { endpointsHandler } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import endpoints from "./definition";
import { newsletterStatusRepository as repository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      repository.getStatus(data, user, locale, logger),
  },
});
