/**
 * System Settings Route Handler
 */

import type { ApiHandlerFunction } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { SystemSettingsRepository } from "./repository";

/**
 * PATCH handler - assembles flat env key fields into settings record.
 * Typed as any because the definition uses dynamic children (one field per env key)
 * which cannot be statically typed through the generic createEndpoint machinery.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patchHandler: ApiHandlerFunction<any, any, any, any, any, any> = ({
  data,
  logger,
  t,
}) => {
  // data is Record<string, string | undefined> (one field per env key).
  const settings: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (typeof value === "string" && value.length > 0) {
      settings[key] = value;
    }
  }
  return SystemSettingsRepository.updateSettings({ settings }, logger, t);
};

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => {
      return SystemSettingsRepository.getSettings(logger, t);
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Methods.PATCH]: { handler: patchHandler } as any,
});
