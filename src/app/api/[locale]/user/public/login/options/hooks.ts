import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import loginEndpoints from "./definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

/**
 * Hook to fetch login options from the API
 * Uses the simplified useEndpoint pattern for better type safety
 * @returns Login options and query state with full CRUD operations
 */
export function useLoginOptions(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof loginEndpoints> {
  return useEndpoint(loginEndpoints, undefined, logger, user);
}
