/**
 * Test Email Hooks
 * Client-side hooks for sending test emails with custom lead data
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  EndpointReturn,
  UseEndpointOptions,
} from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for test email functionality with form capabilities
 */
export function useTestEmailEndpoint(
  user: JwtPayloadType,
  logger: EndpointLogger,
  options?: UseEndpointOptions<typeof definitions>,
): TestEmailEndpointHook {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 0, // Don't cache test email results
        },
      },
      ...options,
    },
    logger,
    user,
  );
}

/**
 * Type exports for convenience
 */
export type TestEmailEndpointHook = EndpointReturn<typeof definitions>;
