/**
 * Import Job Stop Action API Hooks
 * React hooks for stopping import jobs
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for stopping import jobs
 */
export function useStopImportJobEndpoint(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      staleTime: 0, // Always fresh for actions
      refetchOnWindowFocus: false,
      persistForm: false,
    },
    logger,
    user,
  );
}
