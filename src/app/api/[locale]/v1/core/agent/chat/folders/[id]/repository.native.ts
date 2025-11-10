/**
 * Native Folder Repository
 * Implements folder operations for React Native
 *
 * POLYFILL PATTERN: This file makes folder operations work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * Server code can call getFolder() and it will:
 * - On Web/Server: Query the database directly
 * - On React Native: Make HTTP call via nativeEndpoint() with full type safety
 *
 * This allows the SAME code to work on both platforms!
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import definitions from "./definition";
import type { FolderGetResponseOutput } from "./definition";

const getFolderEndpoint = definitions.GET;

/**
 * Get a single folder by ID (native implementation)
 */
export async function getFolder(
  user: JwtPayloadType,
  data: { id: string },
  logger: EndpointLogger,
): Promise<ResponseType<FolderGetResponseOutput>> {
  // Use typesafe nativeEndpoint() with endpoint definition
  // This provides full type inference from the endpoint's schema
  const response = await nativeEndpoint(
    getFolderEndpoint,
    { urlPathParams: { id: data.id } },
    logger,
    "en-GLOBAL",
  );

  if (response.success) {
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  }

  // Error response - preserve all error information
  return {
    success: false,
          errorType: response.errorType,
    message: response.message,
    messageParams: response.messageParams,
  };
}
