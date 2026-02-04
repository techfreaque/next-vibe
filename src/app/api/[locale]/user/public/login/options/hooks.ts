import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";

import loginEndpoints from "./definition";
import type { JwtPayloadType } from "../../../auth/types";

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
