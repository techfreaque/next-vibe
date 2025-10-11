/**
 * Consultation Availability Hooks
 * React hooks for checking consultation availability
 */

"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for checking consultation availability
 */
export function useConsultationAvailability(params: {
  startDate?: string;
  endDate?: string;
  slotDurationMinutes?: number;
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  // Extract and stabilize the actual values used
  const enabled =
    params?.enabled !== false && Boolean(params.startDate && params.endDate);

  // Memoize the queryOptions object to prevent infinite re-renders
  const queryOptions = useMemo(
    () => ({
      enabled,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to keep availability fresh
    }),
    [enabled],
  );

  // Memoize the request data
  const requestData = useMemo(() => {
    if (!params.startDate || !params.endDate) {
      return undefined;
    }

    return {
      startDate: params.startDate,
      endDate: params.endDate,
      slotDurationMinutes: params.slotDurationMinutes || 60,
    };
  }, [params.startDate, params.endDate, params.slotDurationMinutes]);

  return useEndpoint(
    definitions,
    {
      queryOptions: {
        ...queryOptions,
        requestData,
      },
    },
    params.logger,
  );
}

/**
 * Helper hook for getting availability for a specific date range
 */
export function useWeeklyAvailability(params: {
  weekStartDate?: Date;
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  const { startDate, endDate } = useMemo(() => {
    if (!params.weekStartDate) {
      return { startDate: undefined, endDate: undefined };
    }

    const start = new Date(params.weekStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 7 days total

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [params.weekStartDate]);

  return useConsultationAvailability({
    startDate,
    endDate,
    slotDurationMinutes: 60,
    enabled: params.enabled,
    logger: params.logger,
  });
}
