/**
 * Users Create API Hook
 * React hook for creating new users
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

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
