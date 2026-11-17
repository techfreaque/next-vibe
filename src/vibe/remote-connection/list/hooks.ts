/**
 * Remote Connections List API Hooks
 * Type-safe hook for reading the current user's remote connections.
 */

"use client";

import type { JwtPayloadType } from "../../identity/auth/types";
import { UserRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import type { EndpointReturn } from "../../unified-ui/hooks/endpoint-types";
import { useEndpoint } from "../../unified-ui/hooks/use-endpoint";
import definitions from "./definition";

/**
 * Hook for listing the current user's remote connections (GET).
 * Used to detect the system inference provider and drive connection UI.
 * Signed-in accounts only: customers read their own rows + whether they may
 * connect (access.canConnect), which decides the Cloud Sync tab.
 */
export function useRemoteConnections(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  const canRead =
    !user.isPublic &&
    (user.roles.includes(UserRole.ADMIN) ||
      user.roles.includes(UserRole.CUSTOMER));
  return useEndpoint(
    definitions,
    { read: { queryOptions: { enabled: canRead, staleTime: 60_000 } } },
    logger,
    user,
  );
}
