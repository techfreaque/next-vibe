/**
 * Cron Task History Hooks
 * React hooks for task execution history
 */

"use client";

import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";

import endpoints from "./definition";

/**
 * Hook for fetching task execution history
 */
export function useTaskHistory(): ReturnType<typeof useEndpoint> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  return useEndpoint(endpoints, {}, logger);
}
