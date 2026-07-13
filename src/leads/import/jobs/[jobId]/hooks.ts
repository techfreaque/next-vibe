/**
 * Import Job Management API Hooks
 * React hooks for individual job operations (update, delete)
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

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
