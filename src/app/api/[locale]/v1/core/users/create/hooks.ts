/**
 * Users Create API Hook
 * React hook for creating new users
 */

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import definitions from "./definition";

/**
 * Hook for creating users
 * Uses the enhanced useEndpoint library features for clean, minimal code
 */
export function useUsersCreateEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: true,
        persistenceKey: "users-create-form",
      },
    },
    logger,
  );
}

export type UsersCreateEndpointReturn = EndpointReturn<typeof definitions>;
