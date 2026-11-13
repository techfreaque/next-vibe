/**
 * Model Catalog Scan Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ModelCatalogScanRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, t }) => ModelCatalogScanRepository.getLatest(logger, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, locale, logger, t }) =>
      ModelCatalogScanRepository.runScan(data, locale, logger, t),
  },
});
