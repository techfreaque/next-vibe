/**
 * Native Folder Repository
 * Implements FolderRepository static interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import definitions, {
  type FolderDeleteResponseOutput,
  type FolderGetResponseOutput,
  type FolderUpdateRequestOutput,
  type FolderUpdateResponseOutput,
} from "./definition";
import type { FolderRepositoryType } from "./repository";

/**
 * Native Folder Repository - Static class pattern
 */
export class FolderRepository {
  static async getFolder(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>> {
    const response = await nativeEndpoint(
      definitions.GET,
      { urlPathParams: { id: data.id } },
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

  static updateFolder(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _data: FolderUpdateRequestOutput & { id: string },
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("updateFolder is not implemented on native");
  }

  static deleteFolder(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _data: { id: string },
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deleteFolder is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: FolderRepositoryType = FolderRepository;
void _typeCheck;
