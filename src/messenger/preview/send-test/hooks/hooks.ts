/**
 * Email Preview Send Test Hooks
 * React hooks for sending test emails
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

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
  user: JwtPayloadType,
): EmailPreviewSendTestEndpointReturn {
  return useEndpoint(
    definitions,
    {
      create: {
        formOptions: {
          persistForm: false,
        },
      },
    },
    logger,
    user,
  );
}

export type EmailPreviewSendTestEndpointReturn = EndpointReturn<
  typeof definitions
>;
