/**
 * Login Route Handler
 * Production-ready route handler following new pattern
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import endpoints from "./definition";
import { loginRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, request, logger }) =>
      loginRepository.login(data, user, locale, request, logger),
  },
});
