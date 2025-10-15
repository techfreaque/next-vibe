/**
 * Cron Task History Hooks
 * React hooks for task execution history
 */

"use client";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useTranslation } from "@/i18n/core/client";

import endpoints from "./definition";

/**
 * Hook for fetching task execution history
 */
export function useTaskHistory(): EndpointReturn<typeof endpoints> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  return useEndpoint(endpoints.GET, {}, logger);
}

export type CronHistoryEndpointReturn = EndpointReturn<typeof endpoints>;
