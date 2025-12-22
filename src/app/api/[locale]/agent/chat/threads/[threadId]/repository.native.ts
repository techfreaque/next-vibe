/**
 * Native Thread by ID Repository
 * Implements ThreadByIdRepository static interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ThreadDeleteResponseOutput,
  ThreadGetResponseOutput,
  ThreadPatchRequestOutput,
  ThreadPatchResponseOutput,
} from "./definition";
import { GET as getThreadEndpoint } from "./definition";
import type { ThreadByIdRepositoryType } from "./repository";

/**
 * Native Thread by ID Repository - Static class pattern
 */
export class ThreadByIdRepository {
  static async getThreadById(
    threadId: string,
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
    const response = await nativeEndpoint(
      getThreadEndpoint,
      { urlPathParams: { threadId } },
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

  static async updateThread(
    // oxlint-disable-next-line no-unused-vars
    _data: ThreadPatchRequestOutput,
    // oxlint-disable-next-line no-unused-vars
    _threadId: string,
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("updateThread is not implemented on native");
  }

  static async deleteThread(
    // oxlint-disable-next-line no-unused-vars
    _threadId: string,
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deleteThread is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: ThreadByIdRepositoryType = ThreadByIdRepository;
void _typeCheck;
