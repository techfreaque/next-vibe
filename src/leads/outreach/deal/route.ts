/**
 * Outreach Deal - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OutreachDealRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      OutreachDealRepository.upsert(data, logger, t),
  },
});
