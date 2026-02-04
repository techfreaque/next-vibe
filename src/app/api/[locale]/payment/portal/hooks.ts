/**
 * Payment Portal API Hooks
 * Type-safe hooks for interacting with the Payment Portal API
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPayloadType } from "../../user/auth/types";
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

export type CustomerPortalEndpointReturn = EndpointReturn<typeof definitions>;
