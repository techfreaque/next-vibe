/**
 * Email Preview Render Hooks
 * React hooks for rendering email template previews
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
