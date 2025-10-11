/**
 * Payment API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import endpoints from "./definition";
import { paymentRepository as repository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      repository.createPaymentSession(data, user, locale, logger),
  },
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      repository.getPaymentInfo(data, user, locale, logger),
  },
});
