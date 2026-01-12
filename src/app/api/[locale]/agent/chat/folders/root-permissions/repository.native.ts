/**
 * Native Root Folder Permissions Repository
 * Implements RootFolderPermissionsRepository static interface for React Native
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
      messageParams: response.messageParams,
    };
  }
}

// Compile-time type check: ensures native has same static methods as server
const _typeCheck: RootFolderPermissionsRepositoryType =
  RootFolderPermissionsRepository;
void _typeCheck;
