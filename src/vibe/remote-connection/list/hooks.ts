/**
 * Remote Connections List API Hooks
 * Type-safe hook for reading the current user's remote connections.
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for listing the current user's remote connections (GET).
 * Used to detect the system inference provider and drive connection UI.
 */
export function useRemoteConnections(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(definitions, undefined, logger, user);
}
