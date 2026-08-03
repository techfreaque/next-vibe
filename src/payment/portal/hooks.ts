/**
 * Payment Portal API Hooks
 * Type-safe hooks for interacting with the Payment Portal API
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for customer portal management
 * Provides mutation (POST) operations for creating portal sessions
 */
export function useCustomerPortal(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(definitions, undefined, logger, user);
}
