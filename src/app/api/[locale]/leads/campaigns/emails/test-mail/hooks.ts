/**
 * Test Email Hooks
 * Client-side hooks for sending test emails with custom lead data
 */

"use client";

import type {
  EndpointReturn,
  UseEndpointOptions,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for test email functionality with form capabilities
 */
export function useTestEmailEndpoint(
  user: JwtPayloadType,
  logger: EndpointLogger,
  options: UseEndpointOptions<typeof definitions>,
): TestEmailEndpointHook {
  return useEndpoint(
    definitions,
    {
      enabled: options?.enabled !== false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Don't cache test email results
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
