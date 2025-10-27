/**
 * Newsletter Status API Route
 * Get newsletter subscription status for an email
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import endpoints from "./definition";
import { newsletterStatusRepository as repository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      repository.getStatus(data, user, locale, logger),
  },
});
