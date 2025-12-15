/**
 * Native Folder Repository
 * Implements folder operations for React Native
 *
 * POLYFILL PATTERN: This file makes folder operations work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

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
import type { IFolderRepository } from "./repository";

const getFolderEndpoint = definitions.GET;

/**
 * Native folder repository implementation
 * Uses HTTP endpoints for React Native platform
 */
export class FolderNativeRepository implements IFolderRepository {
  async getFolder(
    // oxlint-disable-next-line no-unused-vars
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>> {
    const response = await nativeEndpoint(
      getFolderEndpoint,
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

  updateFolder(
    // oxlint-disable-next-line no-unused-vars
    user: JwtPayloadType,
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    logger.error("updateFolder not implemented on native", {
      folderId: data.id,
    });
    return Promise.resolve(
      fail({
        message: "app.api.agent.chat.folders.id.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { reason: "Not implemented for React Native" },
      }),
    );
  }

  deleteFolder(
    // oxlint-disable-next-line no-unused-vars
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    logger.error("deleteFolder not implemented on native", {
      folderId: data.id,
    });
    return Promise.resolve(
      fail({
        message: "app.api.agent.chat.folders.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { reason: "Not implemented for React Native" },
      }),
    );
  }
}

export const folderNativeRepository = new FolderNativeRepository();
