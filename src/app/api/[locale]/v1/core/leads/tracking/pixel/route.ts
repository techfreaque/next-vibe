/**
 * Email Tracking Pixel Endpoint
 * Handles 1x1 pixel requests for email open tracking
 */

import type { NextRequest } from "next/server";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { env } from "@/config/env";
import { PixelTrackingRepository } from "./repository";

/**
 * GET Handler
 * Serves tracking pixel and records email open
 *
 * Note: This endpoint returns binary data (GIF image) instead of JSON,
 * so it cannot use the standard apiHandler pattern which expects JSON responses.
 * The interface remains the same but follows the definition and repository pattern.
 */
export const GET = (request: NextRequest): Response => {
  // Extract locale from URL path for logger initialization
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const localeSegment = pathSegments.find(segment => /^[a-z]{2}-[A-Z]{2}$/.test(segment)) || 'en-US';
  
  const logger = createEndpointLogger(
    env.NODE_ENV === "development",
    Date.now(),
    localeSegment,
  );
  
  return PixelTrackingRepository.handlePixelRequest(request, logger);
};
