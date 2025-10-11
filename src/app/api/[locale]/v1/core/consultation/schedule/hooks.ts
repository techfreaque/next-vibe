/**
 * Consultation Schedule Hooks
 * React hooks for consultation scheduling operations
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for scheduling consultations using the unified endpoint system
 */
export function useScheduleConsultation(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      enabled: false, // This is a mutation-only endpoint
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
    logger,
  );
}
