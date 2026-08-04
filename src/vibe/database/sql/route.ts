/**
 * Execute SQL query Route
 * API route for execute sql query
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import sqlEndpoints from "./definition";
import { SqlRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: sqlEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => SqlRepository.execute(data, t, logger),
  },
});
