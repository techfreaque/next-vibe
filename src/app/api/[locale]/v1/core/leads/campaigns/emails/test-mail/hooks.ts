/**
 * Test Email Hooks
 * Client-side hooks for sending test emails with custom lead data
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type {
  EndpointReturn,
  UseEndpointOptions,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for test email functionality with form capabilities
 */
export function useTestEmailEndpoint(
  logger: EndpointLogger,
  options?: UseEndpointOptions<typeof definitions>,
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
  );
}

/**
 * Type exports for convenience
 */
export type TestEmailEndpointHook = EndpointReturn<typeof definitions>;
