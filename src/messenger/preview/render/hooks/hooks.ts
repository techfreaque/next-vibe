/**
 * Email Preview Render Hooks
 * React hooks for rendering email template previews
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import definitions from "../definition";

/**
 * Hook for rendering email template previews
 *
 * Supports:
 * - Template ID selection
 * - Language and country configuration
 * - Custom props for template rendering
 *
 * Returns:
 * - html: Rendered HTML content
 * - subject: Email subject line
 * - templateVersion: Version of the template
 */
export function useEmailPreviewRender(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EmailPreviewRenderEndpointReturn {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: false, // Manual trigger
          staleTime: 30 * 1000, // 30 seconds
        },
      },
    },
    logger,
    user,
  );
}

export type EmailPreviewRenderEndpointReturn = EndpointReturn<
  typeof definitions
>;
