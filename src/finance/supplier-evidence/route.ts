import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SupplierEvidenceRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, t, logger }) =>
      SupplierEvidenceRepository.list(
        data.companyId,
        data.month,
        user.id,
        t,
        logger,
      ),
  },
  [Methods.POST]: {
    handler: ({ data, user, t, logger }) =>
      SupplierEvidenceRepository.record(data, user.id, t, logger),
  },
});
