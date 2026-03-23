/**
 * Users Login Attempts Total - Route
 * Server-only.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { QueryUsersLoginAttemptsTotalRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryUsersLoginAttemptsTotalRepository.queryUsersLoginAttemptsTotal(data),
  },
});
