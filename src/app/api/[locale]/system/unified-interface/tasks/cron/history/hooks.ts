/**
 * Cron Task History Hooks
 * React hooks for task execution history
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { useLogger } from "@/hooks/use-logger";
import endpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useMemo } from "react";

/**
 * Hook for fetching task execution history
 */
export function useTaskHistory(
  user: JwtPayloadType,
): EndpointReturn<typeof endpoints> {
  const logger = useLogger();
  const endpointOptions = useMemo(
    () => ({
      read: {
        formOptions: {
          autoSubmit: true,
          debounceMs: 300,
          persistForm: true,
        },
      },
    }),
    [],
  );

  return useEndpoint(endpoints, endpointOptions, logger, user);
}

export type CronHistoryEndpointReturn = EndpointReturn<typeof endpoints>;
