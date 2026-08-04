/**
 * Error Logs Errors - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";
import definitions from "./definition";
import { QueryErrorLogsErrorsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryErrorLogsErrorsRepository.queryErrorLogsErrors(data),
  },
});
