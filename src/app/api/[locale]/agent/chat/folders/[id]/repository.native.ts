/**
 * Native Folder Repository
 * Implements folder operations for React Native
 *
 * POLYFILL PATTERN: This file makes folder operations work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 */

import {
  fail,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import definitions, {
  type FolderDeleteResponseOutput,
  type FolderGetResponseOutput,
  type FolderUpdateRequestOutput,
  type FolderUpdateResponseOutput,
} from "./definition";

const getFolderEndpoint = definitions.GET;

/**
 * Interface for folder repository operations (native version)
 */
interface IFolderNativeRepository {
  getFolder(
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>>;

  updateFolder(
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>>;

  deleteFolder(
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>>;
}

/**
 * Native folder repository implementation
 * Uses HTTP endpoints for React Native platform
 */
export class FolderNativeRepository implements IFolderNativeRepository {
  async getFolder(
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

  async updateFolder(
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    logger.error("updateFolder not implemented on native", {
      folderId: data.id,
      locale,
    });
    return fail({
      message: "app.api.agent.chat.folders.id.patch.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { reason: "Not implemented for React Native" },
    });
  }

  async deleteFolder(
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    logger.error("deleteFolder not implemented on native", {
      folderId: data.id,
      locale,
    });
    return fail({
      message: "app.api.agent.chat.folders.id.delete.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { reason: "Not implemented for React Native" },
    });
  }
}

export const folderNativeRepository = new FolderNativeRepository();
