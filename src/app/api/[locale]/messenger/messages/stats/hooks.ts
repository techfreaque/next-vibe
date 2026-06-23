/**
 * Email Messages Stats Hooks
 * React hooks for email statistics and analytics
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";

import type { JwtPayloadType } from "../../../user/auth/types";
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
