/**
 * Native Folder Repository
 * Implements FolderRepository static interface for React Native
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { nativeEndpoint } from "next-vibe/platforms/react-native/native-endpoint";

import definitions, {
  type FolderDeleteResponseOutput,
  type FolderGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import type { FolderRepositoryType } from "./repository";
import type {
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
} from "./update/definition";

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
      { urlPathParams: { subFolderId: data.id } },
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

  static updateFolder(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _data: FolderUpdateRequestOutput & { id: string },
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("errors.not_implemented_on_native", {
          method: "updateFolder",
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      }),
    );
  }

  static deleteFolder(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _data: { id: string },
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("errors.not_implemented_on_native", {
          method: "deleteFolder",
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      }),
    );
  }
}

// Compile-time type check
const _typeCheck: FolderRepositoryType = FolderRepository;
void _typeCheck;
