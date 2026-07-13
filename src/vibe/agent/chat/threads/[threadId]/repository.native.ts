/**
 * Native Thread by ID Repository
 * Implements ThreadByIdRepository static interface for React Native
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { nativeEndpoint } from "next-vibe/platforms/react-native/native-endpoint";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import type {
  ThreadDeleteResponseOutput,
  ThreadGetResponseOutput,
  ThreadPatchRequestOutput,
  ThreadPatchResponseOutput,
} from "./definition";
import threadByIdEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
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
      threadByIdEndpoints.GET,
      {
        data: { rootFolderId: DefaultFolderId.PRIVATE },
        urlPathParams: { threadId },
      },
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
    locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    return fail({
      message: t("errors.not_implemented_on_native", {
        method: "updateThread",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  static async deleteThread(
    // oxlint-disable-next-line no-unused-vars
    _threadId: string,
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    return fail({
      message: t("errors.not_implemented_on_native", {
        method: "deleteThread",
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Cross-instance remote-event appliers never fire on native (native is not a
  // sync peer) — no-op stubs satisfy the shared repository interface.
  // oxlint-disable-next-line no-unused-vars
  static async applyRemoteThreadUpdate(
    // oxlint-disable-next-line no-unused-vars
    _props: RemoteEventHandlerProps<
      typeof threadByIdEndpoints.PATCH,
      "thread-updated"
    >,
  ): Promise<void> {
    return Promise.resolve();
  }

  // oxlint-disable-next-line no-unused-vars
  static async applyRemoteThreadDelete(
    // oxlint-disable-next-line no-unused-vars
    _props: RemoteEventHandlerProps<
      typeof threadByIdEndpoints.DELETE,
      "thread-deleted"
    >,
  ): Promise<void> {
    return Promise.resolve();
  }
}

// Compile-time type check
const _typeCheck: ThreadByIdRepositoryType = ThreadByIdRepository;
void _typeCheck;
