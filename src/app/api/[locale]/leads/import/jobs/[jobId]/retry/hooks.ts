/**
 * Import Job Retry Action API Hooks
 * React hooks for retrying import jobs
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for retrying import jobs
 */
export function useRetryImportJobEndpoint(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          staleTime: 0, // Always fresh for actions
          refetchOnWindowFocus: false,
        },
      },
      create: {
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}
