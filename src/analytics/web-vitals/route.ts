/**
 * Web Vitals route handlers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { WebVitalsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, request, locale, logger }) =>
      WebVitalsRepository.record(
        data,
        request?.headers.get("user-agent") ?? null,
        locale,
        logger,
      ),
  },
  [Methods.GET]: {
    handler: ({ data, locale, logger }) =>
      WebVitalsRepository.report(data, locale, logger),
  },
});
