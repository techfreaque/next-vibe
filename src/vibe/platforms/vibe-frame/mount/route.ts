/**
 * Vibe Frame Config - Route
 *
 * Public POST endpoint. The embed script (always cross-origin) passes identity
 * (leadId + authToken) in the POST body. No session cookie required.
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import definitions from "./definition";
import { VibeFrameConfigRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, locale, logger }) =>
      VibeFrameConfigRepository.config({ data, locale, logger }),
  },
});
