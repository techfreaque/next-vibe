/**
 * Run database seeds Route
 * API route for run database seeds
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import seedEndpoints from "./definition";
import { SeedRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: seedEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => SeedRepository.execute(data, t, logger),
  },
});
