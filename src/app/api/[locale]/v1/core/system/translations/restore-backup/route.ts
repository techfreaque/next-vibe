/**
 * Translation Backup Restore API Route Handler
 * Handles POST requests for restoring translation files from backups
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { translationReorganizeRepository } from "../reorganize/repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, locale, logger }) => {
      return translationReorganizeRepository.restoreFromBackupEndpoint(
        data,
        locale,
        logger,
      );
    },
  },
});
