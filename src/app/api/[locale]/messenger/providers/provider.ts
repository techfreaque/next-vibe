/**
 * Messenger Provider Interface
 * Unified abstraction for all message channels and sending providers.
 * Every provider implements this interface so the rest of the system
 * doesn't care whether it's SMTP, Resend, Twilio, WhatsApp or Telegram.
 *
 * All methods are required — providers that don't support a feature must
 * return fail({ errorType: NOT_SUPPORTED }) rather than omitting the method.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { MessageChannelValue } from "../accounts/enum";

// ─── Send Types ──────────────────────────────────────────────────────────────

export interface SendMessageInput {
  /** Recipient — email address, phone number, or chat ID depending on channel */
  to: string;
  toName?: string;
  /** Short subject line (email only; optional for other channels) */
  subject?: string;
  /** Plain-text body */
  text: string;
  /** HTML body (email only) */
  html?: string;
  /** Reply-to address (email only) */
  replyTo?: string;
  /** Unsubscribe URL added to headers/footer (email only) */
  unsubscribeUrl?: string;
  /** Display name of the sender */
  senderName?: string;
  /** Optional associations for tracking */
  leadId?: string;
  campaignId?: string;
  userId?: string;
}

export interface SendMessageResult {
  /** Provider-assigned message ID */
  messageId: string;
  /** Which account/credential was used */
  accountId: string;
  accountName: string;
  /** Addresses/IDs the provider accepted */
  accepted: string[];
  /** Addresses/IDs the provider rejected */
  rejected: string[];
  /** Raw provider response string */
  providerResponse: string;
}

// ─── Inbox Types ─────────────────────────────────────────────────────────────

export interface InboxMessage {
  uid: number;
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  bodyText?: string;
  bodyHtml?: string;
  isRead: boolean;
  isFlagged: boolean;
  folderId?: string;
  folderPath?: string;
  threadId?: string;
  inReplyTo?: string;
}

export interface InboxFolder {
  id?: string;
  path: string;
  name: string;
  displayName?: string;
  specialUseType?: string;
  messageCount: number;
  unseenCount: number;
}

// ─── Provider Interface ───────────────────────────────────────────────────────

export interface MessengerProvider {
  /** Which message channel this provider handles */
  readonly channel: typeof MessageChannelValue;
  /** Human-readable provider name, e.g. "SMTP", "Resend", "Twilio" */
  readonly name: string;

  /** Send a message. Returns the send result or a failure. */
  send(
    input: SendMessageInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendMessageResult>>;

  /** List messages from the inbox or a specific folder. */
  listInbox(
    accountId: string,
    folderPath: string | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMessage[]>>;

  /** List available folders. */
  listFolders(
    accountId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxFolder[]>>;

  /** Move a message to a different folder. */
  moveMessage(
    accountId: string,
    uid: number,
    fromFolder: string,
    toFolder: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>>;

  /** Mark a message as read or unread. */
  markRead(
    accountId: string,
    uid: number,
    folderPath: string,
    isRead: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>>;
}
