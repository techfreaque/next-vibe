/**
 * Cron Task History Hooks
 * React hooks for task execution history
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import { useMemo } from "react";

import { useLogger } from "@/hooks/use-logger";

import endpoints from "./definition";

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
