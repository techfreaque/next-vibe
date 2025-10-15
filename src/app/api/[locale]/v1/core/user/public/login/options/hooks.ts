import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import loginEndpoints from "./definition";

/**
 * Hook to fetch login options from the API
 * Uses the simplified useEndpoint pattern for better type safety
 * @returns Login options and query state with full CRUD operations
 */
export function useLoginOptions(
  logger: EndpointLogger,
): EndpointReturn<typeof loginEndpoints> {
  return useEndpoint(loginEndpoints, {}, logger);
}
