/**
 * Users Login Attempts Failed - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { QueryUsersLoginAttemptsFailedRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryUsersLoginAttemptsFailedRepository.queryUsersLoginAttemptsFailed(
        data,
      ),
  },
});
