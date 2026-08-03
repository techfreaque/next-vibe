/**
 * Native Root Folder Permissions Repository
 * Implements RootFolderPermissionsRepository static interface for React Native
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { nativeEndpoint } from "next-vibe/platforms/react-native/native-endpoint";

import type {
  RootPermissionsGetRequestOutput,
  RootPermissionsGetResponseOutput,
} from "./definition";
import definitions from "./definition";
import type { RootFolderPermissionsRepositoryType } from "./repository";

/**
 * Native Root Folder Permissions Repository - Static class pattern
 */
export class RootFolderPermissionsRepository {
  static async getRootFolderPermissions(
    data: RootPermissionsGetRequestOutput,
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<RootPermissionsGetResponseOutput>> {
    const response = await nativeEndpoint(
      definitions.GET,
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

    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
    };
  }
}

// Compile-time type check: ensures native has same static methods as server
const _typeCheck: RootFolderPermissionsRepositoryType =
  RootFolderPermissionsRepository;
void _typeCheck;
