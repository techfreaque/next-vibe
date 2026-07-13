/**
 * Import Job Stop Action API Hooks
 * React hooks for stopping import jobs
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for stopping import jobs
 */
export function useStopImportJobEndpoint(
  params: { jobId: string },
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      create: {
        urlPathParams: { jobId: params.jobId },
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}
