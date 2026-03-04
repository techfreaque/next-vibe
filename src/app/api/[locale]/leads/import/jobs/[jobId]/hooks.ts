/**
 * Import Job Management API Hooks
 * React hooks for individual job operations (update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for import job operations (update and delete)
 */
export function useImapJobEndpoint(
  params: { jobId: string },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { jobId: params.jobId },
        queryOptions: {
          staleTime: 0, // Always fresh for job operations
          refetchOnWindowFocus: false,
        },
      },
      update: {
        urlPathParams: { jobId: params.jobId },
        formOptions: {
          persistForm: false,
        },
      },
      delete: {
        urlPathParams: { jobId: params.jobId },
      },
    },
    logger,
    user,
  );
}
