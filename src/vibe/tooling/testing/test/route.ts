/**
 * Run tests Route
 * API route for run tests
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import testEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: testEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).TestRepository.execute(data, logger, t),
  },
});
