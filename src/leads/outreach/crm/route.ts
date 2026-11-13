/**
 * Outreach CRM - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { OutreachCrmRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, t }) =>
      OutreachCrmRepository.dashboard(data, logger, t),
  },
});
