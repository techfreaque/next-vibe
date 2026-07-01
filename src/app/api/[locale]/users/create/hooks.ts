/**
 * Users Create API Hook
 * React hook for creating new users
 */

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for creating users
 * Uses the enhanced useEndpoint library features for clean, minimal code
 */
export function useUsersCreateEndpoint(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      create: {
        formOptions: {
          persistForm: true,
          persistenceKey: "users-create-form",
        },
      },
    },
    logger,
    user,
  );
}

export type UsersCreateEndpointReturn = EndpointReturn<typeof definitions>;
