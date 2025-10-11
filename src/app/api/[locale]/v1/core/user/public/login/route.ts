/**
 * Login Route Handler
 * Production-ready route handler following new pattern
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import type { JWTPublicPayloadType } from "../../auth/definition";
import endpoints from "./definition";
import { loginRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      loginRepository.login(data, user as JWTPublicPayloadType, locale, logger),
  },
});
