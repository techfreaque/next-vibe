/**
 * Individual User API Hook
 * React hook for individual user operations (get, update, delete)
 */

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for individual user operations (get, update, delete)
 * Uses the simplified interface with URL parameters as top-level option
 * Following the cron pattern for consistency
 */
export function useUserByIdEndpoint(
  params: {
    userId: string;
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): UserByIdEndpointHook {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { id: params.userId },
        queryOptions: {
          enabled: params.enabled,
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
        },
      },
      create: {
        urlPathParams: { id: params.userId },
        formOptions: {
          persistForm: false,
          persistenceKey: `user-edit-${params.userId}-form`, // eslint-disable-line i18next/no-literal-string -- Form persistence key
        },
      },
      delete: {
        urlPathParams: { id: params.userId },
      },
    },
    logger,
    user,
  );
}

/**
 * Type exports for convenience
 */
export type UserByIdEndpointHook = EndpointReturn<typeof definitions>;
