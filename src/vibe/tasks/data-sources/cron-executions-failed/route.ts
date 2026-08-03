/**
 * Cron Executions Failed - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import definitions from "./definition";
import { QueryCronExecutionsFailedRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryCronExecutionsFailedRepository.queryCronExecutionsFailed(data),
  },
});
