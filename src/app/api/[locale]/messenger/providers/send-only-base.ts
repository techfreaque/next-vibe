/**
 * SendOnlyProvider — abstract base for providers that only support outbound messaging.
 * (Resend email, Twilio SMS, WhatsApp Business, Telegram Bot)
 *
 * Inbox operations are not technically supported by these channels/APIs.
 * All four inbox methods return a failure with proper interface signatures so
 * TypeScript is satisfied and callers get a meaningful error.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  InboxFolder,
  InboxMessage,
  MessengerProvider,
  SendMessageInput,
  SendMessageResult,
} from "./provider";
import { scopedTranslation as providerScopedTranslation } from "./i18n";
import type { MessageChannelValue } from "../accounts/enum";

export abstract class SendOnlyProvider implements MessengerProvider {
  abstract readonly channel: typeof MessageChannelValue;
  abstract readonly name: string;

  abstract send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>>;

  listInbox(
    accountId: string,
    folderPath: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMessage[]>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("providers.errors.notSupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    );
  }

  listFolders(
    accountId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxFolder[]>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("providers.errors.notSupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    );
  }

  moveMessage(
    accountId: string,
    uid: number,
    fromFolder: string,
    toFolder: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("providers.errors.notSupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    );
  }

  markRead(
    accountId: string,
    uid: number,
    folderPath: string,
    isRead: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = providerScopedTranslation.scopedT(locale);
    return Promise.resolve(
      fail({
        message: t("providers.errors.notSupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    );
  }
}
