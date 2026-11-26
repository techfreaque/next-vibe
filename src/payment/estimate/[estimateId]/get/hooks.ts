"use client";

import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo } from "react";

import definition, { type EstimateGetResponseOutput } from "./definition";

/**
 * Loads the estimate an action widget (accept, decline, duplicate, line
 * removal) applies to, so the confirmation shows number, customer and total.
 */
export function useEstimateActionContext(
  estimateId: string | undefined,
  enabled: boolean,
): { estimate: EstimateGetResponseOutput | undefined; loading: boolean } {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const active = enabled && Boolean(estimateId);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { estimateId: estimateId ?? "" },
        queryOptions: {
          enabled: active,
          staleTime: 0,
          refetchOnMount: "always" as const,
          disableLocalCache: true,
          queryKey: `estimate-action-context:${estimateId ?? ""}`,
        },
      },
    }),
    [estimateId, active],
  );
  const read = useEndpoint(definition, options, logger, user).read;
  const response = read?.response;
  return {
    estimate:
      response?.success && response.data.id === estimateId
        ? response.data
        : undefined,
    loading: active && Boolean(read?.isLoading || read?.isFetching),
  };
}
