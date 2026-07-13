/**
 * Email Messages Stats Hooks
 * React hooks for email statistics and analytics
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching email statistics
 */
export function useEmailMessagesStats(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type EmailMessagesStatsEndpointReturn = EndpointReturn<
  typeof definitions
>;
