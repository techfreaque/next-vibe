/**
 * Native Root Folder Permissions Repository
 * Implements RootFolderPermissionsRepositoryInterface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * Server code can call rootFolderPermissionsRepository.getRootFolderPermissions() and it will:
 * - On Web/Server: Compute permissions directly
 * - On React Native: Make HTTP call via nativeEndpoint() with full type safety
 *
 * This allows the SAME code to work on both platforms!
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  RootPermissionsGetRequestOutput,
  RootPermissionsGetResponseOutput,
} from "./definition";
import { GET as getRootPermissionsEndpoint } from "./definition";
import type { RootFolderPermissionsRepositoryInterface } from "./repository";

/**
 * Native Root Folder Permissions Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class RootFolderPermissionsRepositoryNativeImpl implements RootFolderPermissionsRepositoryInterface {
  async getRootFolderPermissions(
    data: RootPermissionsGetRequestOutput,
    // eslint-disable-next-line no-unused-vars -- Required by interface, native impl uses HTTP client instead
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<RootPermissionsGetResponseOutput>> {
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    const response = await nativeEndpoint(
      getRootPermissionsEndpoint,
      { data },
      logger,
      locale,
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
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const rootFolderPermissionsRepository =
  new RootFolderPermissionsRepositoryNativeImpl();
