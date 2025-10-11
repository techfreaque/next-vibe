/**
 * Translation Backup Restore API Route Handler
 * Handles POST requests for restoring translation files from backups
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { translationReorganizeRepository } from "../reorganize/repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, locale, logger }) => {
      return await translationReorganizeRepository.restoreFromBackupEndpoint(
        data,
        locale,
        logger,
      );
    },
  },
});
