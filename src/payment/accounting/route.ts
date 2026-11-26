import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import {
  listProcessorEvidence,
  reconcileProcessorEvidence,
} from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t }) =>
      listProcessorEvidence(data.companyId, user.id, logger, locale, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      reconcileProcessorEvidence(
        data.companyId,
        data.evidenceIds,
        data.dryRun,
        user.id,
        logger,
        locale,
      ),
  },
});
