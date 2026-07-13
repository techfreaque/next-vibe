/**
 * Setup Status Route
 * API route for checking CLI installation status
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import statusEndpoints from "./definition";
import { SetupStatusRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: statusEndpoints,
  [Methods.POST]: {
    handler: ({ user, t }) => SetupStatusRepository.getStatus(user, t),
  },
});
