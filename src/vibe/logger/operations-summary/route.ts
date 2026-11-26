import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoint from "./definition";
import { getOperationsSummary } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint,
  [Methods.GET]: {
    email: undefined,
    handler: () => getOperationsSummary(),
  },
});
