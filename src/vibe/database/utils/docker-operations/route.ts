/**
 * Docker Operations Route
 * HTTP endpoint for Docker command execution
 * Optional route - only created because HTTP access is useful for this utility
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { DockerOperationsRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      DockerOperationsRepository.executeCommand(data, t, logger),
  },
});
