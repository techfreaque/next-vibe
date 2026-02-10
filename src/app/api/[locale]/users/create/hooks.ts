/**
 * Users Create API Hook
 * React hook for creating new users
 */

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPayloadType } from "../../user/auth/types";
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
