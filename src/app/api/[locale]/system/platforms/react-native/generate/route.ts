/**
 * Generate Expo Indexes Route
 * API route for generating Expo Router index files from Next.js pages
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import generateEndpoints from "./definition";
import { GenerateExpoIndexesRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: ({ user, t }) => GenerateExpoIndexesRepository.generate(user, t),
  },
});
