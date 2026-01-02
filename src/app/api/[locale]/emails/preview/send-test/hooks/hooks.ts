/**
 * Email Preview Send Test Hooks
 * React hooks for sending test emails
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "../definition";

/**
 * Hook for sending test emails
 *
 * Supports:
 * - Template ID selection
 * - Recipient email address
 * - Language and country configuration
 * - Custom props for template rendering
 *
 * Returns:
 * - success: Whether the email was sent successfully
 * - message: Success or error message
 */
export function useEmailPreviewSendTest(
  logger: EndpointLogger,
): EmailPreviewSendTestEndpointReturn {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

export type EmailPreviewSendTestEndpointReturn = EndpointReturn<typeof definitions>;
