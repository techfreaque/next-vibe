/**
 * Cron Task History Hooks
 * React hooks for task execution history
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import endpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

/**
 * Hook for fetching task execution history
 */
export function useTaskHistory(
  user: JwtPayloadType,
): EndpointReturn<typeof endpoints> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  return useEndpoint(endpoints, undefined, logger, user);
}

export type CronHistoryEndpointReturn = EndpointReturn<typeof endpoints>;
