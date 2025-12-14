/**
 * Native Thread by ID Repository
 * Implements ThreadByIdRepositoryInterface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * IMPLEMENTATION STRATEGY:
 * - getThreadById(): Fully implemented with nativeEndpoint()
 * - Other methods: Return "not implemented" errors (can be added when needed)
 *
 * Server code can call threadByIdRepository.getThreadById() and it will:
 * - On Web/Server: Query the database directly
 * - On React Native: Make HTTP call via nativeEndpoint() with full type safety
 *
 * This allows the SAME code to work on both platforms!
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

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
import type { ThreadByIdRepositoryInterface } from "./repository";

/**
 * Native Thread by ID Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class ThreadByIdRepositoryNativeImpl implements ThreadByIdRepositoryInterface {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return fail({
      message:
        "app.api.agent.chat.threads.threadId.errors.not_implemented_on_native",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { method },
    });
  }

  async getThreadById(
    threadId: string,
    // oxlint-disable-next-line no-unused-vars
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
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

    // Error response - preserve all error information
    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  async updateThread(
    data: ThreadPatchRequestOutput,
    threadId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    logger.error("updateThread not implemented on native", {
      threadId,
      userId: user.isPublic ? "public" : user.id,
      data,
    });
    return await Promise.resolve(
      this.createNotImplementedError<ThreadPatchResponseOutput>("updateThread"),
    );
  }

  async deleteThread(
    threadId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    logger.error("deleteThread not implemented on native", {
      threadId,
      userId: user.isPublic ? "public" : user.id,
    });
    return await Promise.resolve(
      this.createNotImplementedError<ThreadDeleteResponseOutput>(
        "deleteThread",
      ),
    );
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const threadByIdRepository = new ThreadByIdRepositoryNativeImpl();
