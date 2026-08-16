/**
 * Remote Connections List API Hooks
 * Type-safe hook for reading the current user's remote connections.
 */

"use client";

import { UserRole } from "../../identity/roles/enum";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { EndpointReturn } from "../../unified-ui/hooks/endpoint-types";
import { useEndpoint } from "../../unified-ui/hooks/use-endpoint";
import definitions from "./definition";

/**
 * Hook for listing the current user's remote connections (GET).
 * Used to detect the system inference provider and drive connection UI.
 */
export function useRemoteConnections(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  return useEndpoint(
    definitions,
    { read: { queryOptions: { enabled: isAdmin } } },
    logger,
    user,
  );
}
