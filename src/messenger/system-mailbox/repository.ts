/**
 * System Mailbox Repository
 * Send / read / report through the platform-owned mailbox (messenger_accounts
 * row with isSystem = true; credentials from env at runtime).
 *
 * Single transactional sends only. No bulk path exists here: one recipient per
 * call, hard hourly cap, every send recorded in `emails`.
 */

import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { MessengerAccount } from "../accounts/db";
import { messengerAccounts } from "../accounts/db";
import {
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider,
} from "../accounts/enum";
import { emails } from "../messages/db";
import { MessageStatus, MessageType } from "../messages/enum";
import {
  EmailImapAuthMethod,
  EmailSecurityType,
} from "../providers/email/enum";
import { SmtpRepository } from "../providers/email/smtp-client/repository";
import type { ComposedMessage } from "./compose";
import { composeMessage, isValidRecipient } from "./compose";
import type { SystemMailboxConfig, SystemMailboxEnvValues } from "./config";
import {
  resolveSystemMailboxConfig,
  SYSTEM_MAILBOX_DEFAULT_NAME,
  SYSTEM_MAILBOX_IMAP_PORT,
  SYSTEM_MAILBOX_SMTP_PORT,
} from "./config";
import { systemMailboxEnv } from "./env";
import type { InboxMessageFull, InboxMessageSummary } from "./imap-ops";
import { appendToSent, listInbox, readInboxMessage } from "./imap-ops";
import type { SystemMailboxT } from "./i18n";

const HOUR_MS = 3600000;
export const MAX_INBOX_LIMIT = 50;

/** Side-effect boundary. Tests replace it; production uses `defaultDeps`. */
export interface SystemMailboxDeps {
  env: () => SystemMailboxEnvValues;
  loadRow: (logger: EndpointLogger) => Promise<MessengerAccount | null>;
  sendRaw: (
    config: SystemMailboxConfig,
    message: ComposedMessage,
  ) => Promise<void>;
  appendSent: (
    config: SystemMailboxConfig,
    message: ComposedMessage,
  ) => Promise<string>;
  countSentSince: (accountId: string | null, since: Date) => Promise<number>;
  recordSent: (
    config: SystemMailboxConfig,
    message: ComposedMessage,
    userId: string | undefined,
  ) => Promise<void>;
  listInbox: (
    config: SystemMailboxConfig,
    options: { limit: number; unreadOnly: boolean },
  ) => Promise<InboxMessageSummary[]>;
  readMessage: (
    config: SystemMailboxConfig,
    uid: number,
  ) => Promise<InboxMessageFull | null>;
  now: () => Date;
}

/**
 * Find the admin-designated system account; if none exists and the env is
 * complete, create it (without any password - that stays in env).
 */
async function loadOrCreateRow(
  logger: EndpointLogger,
): Promise<MessengerAccount | null> {
  const [existing] = await db
    .select()
    .from(messengerAccounts)
    .where(eq(messengerAccounts.isSystem, true))
    .limit(1);
  if (existing) {
    return existing;
  }
  const env = systemMailboxEnv;
  if (!env.THEA_MAIL_ADDRESS || !env.THEA_MAIL_HOST) {
    return null;
  }
  const [created] = await db
    .insert(messengerAccounts)
    .values({
      name: SYSTEM_MAILBOX_DEFAULT_NAME,
      description: "Platform-owned ops mailbox (credentials from env)",
      channel: MessageChannel.EMAIL,
      provider: MessengerProvider.SMTP,
      smtpHost: env.THEA_MAIL_HOST,
      smtpPort: SYSTEM_MAILBOX_SMTP_PORT,
      smtpSecurityType: EmailSecurityType.SSL,
      smtpUsername: env.THEA_MAIL_ADDRESS,
      smtpFromEmail: env.THEA_MAIL_ADDRESS,
      smtpFromName: SYSTEM_MAILBOX_DEFAULT_NAME,
      smtpRateLimitPerHour: env.THEA_MAIL_RATE_LIMIT_PER_HOUR,
      imapHost: env.THEA_MAIL_HOST,
      imapPort: SYSTEM_MAILBOX_IMAP_PORT,
      imapSecure: true,
      imapUsername: env.THEA_MAIL_ADDRESS,
      imapAuthMethod: EmailImapAuthMethod.PLAIN,
      imapSyncEnabled: false,
      status: MessengerAccountStatus.ACTIVE,
      isSystem: true,
      campaignTypes: [],
    })
    .onConflictDoNothing()
    .returning();
  if (created) {
    logger.info("Created platform mailbox account row", { id: created.id });
    return created;
  }
  const [again] = await db
    .select()
    .from(messengerAccounts)
    .where(eq(messengerAccounts.isSystem, true))
    .limit(1);
  return again ?? null;
}

export const defaultSystemMailboxDeps: SystemMailboxDeps = {
  env: () => ({
    THEA_MAIL_ADDRESS: systemMailboxEnv.THEA_MAIL_ADDRESS,
    THEA_MAIL_HOST: systemMailboxEnv.THEA_MAIL_HOST,
    THEA_MAIL_PASSWORD: systemMailboxEnv.THEA_MAIL_PASSWORD,
    THEA_MAIL_REPORT_TO: systemMailboxEnv.THEA_MAIL_REPORT_TO,
    THEA_MAIL_RATE_LIMIT_PER_HOUR:
      systemMailboxEnv.THEA_MAIL_RATE_LIMIT_PER_HOUR,
  }),
  loadRow: loadOrCreateRow,
  sendRaw: async (config, message) => {
    const transport = SmtpRepository.createTransportFromParams(config.smtp);
    try {
      await transport.sendMail({
        envelope: { from: message.from, to: [message.to] },
        raw: message.raw,
      });
    } finally {
      transport.close();
    }
  },
  appendSent: (config, message) => appendToSent(config.imap, message.raw),
  countSentSince: async (accountId, since) => {
    if (!accountId) {
      return 0;
    }
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(emails)
      .where(and(eq(emails.accountId, accountId), gte(emails.sentAt, since)));
    return Number(row?.count ?? 0);
  },
  recordSent: async (config, message, userId) => {
    await db.insert(emails).values({
      subject: message.subject,
      recipientEmail: message.to,
      senderEmail: message.from,
      senderName: config.fromName,
      accountId: config.accountId,
      messageId: message.messageId,
      type: MessageType.SYSTEM,
      status: MessageStatus.SENT,
      sentAt: new Date(),
      userId,
      channel: MessageChannel.EMAIL,
    });
  },
  listInbox: (config, options) => listInbox(config.imap, options),
  readMessage: (config, uid) => readInboxMessage(config.imap, uid),
  now: () => new Date(),
};

export interface SystemMailboxSendInput {
  to: string;
  subject: string;
  text: string;
  html?: string | undefined;
}

export interface SystemMailboxSendResult {
  messageId: string;
  from: string;
  toAddress: string;
  storedInSent: boolean;
  sentFolder: string | null;
  sentLastHour: number;
  rateLimitPerHour: number;
}

export class SystemMailboxRepository {
  /** Replaceable in tests. */
  static deps: SystemMailboxDeps = defaultSystemMailboxDeps;

  static async getConfig(
    logger: EndpointLogger,
    t: SystemMailboxT,
  ): Promise<ResponseType<SystemMailboxConfig>> {
    try {
      const row = await SystemMailboxRepository.deps.loadRow(logger);
      const config = resolveSystemMailboxConfig(
        row,
        SystemMailboxRepository.deps.env(),
      );
      if (!config) {
        return fail({
          message: t("errors.notConfigured"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success(config);
    } catch (error) {
      logger.error("System mailbox config failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Default report recipient (admin env). */
  static getDefaultReportRecipient(): string | null {
    const value = SystemMailboxRepository.deps.env().THEA_MAIL_REPORT_TO;
    return value && value.trim() !== "" ? value.trim() : null;
  }

  static async send(
    input: SystemMailboxSendInput,
    userId: string | undefined,
    logger: EndpointLogger,
    t: SystemMailboxT,
  ): Promise<ResponseType<SystemMailboxSendResult>> {
    const deps = SystemMailboxRepository.deps;
    try {
      if (!isValidRecipient(input.to)) {
        return fail({
          message: t("errors.invalidRecipient"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const configResult = await SystemMailboxRepository.getConfig(logger, t);
      if (!configResult.success) {
        return configResult;
      }
      const config = configResult.data;

      // Rate guard: hard cap per rolling hour, counted from persisted sends.
      const now = deps.now();
      const sentLastHour = await deps.countSentSince(
        config.accountId,
        new Date(now.getTime() - HOUR_MS),
      );
      if (sentLastHour >= config.rateLimitPerHour) {
        logger.warn("System mailbox rate limit reached", {
          sentLastHour,
          limit: config.rateLimitPerHour,
        });
        return fail({
          message: t("errors.rateLimited", {
            sent: String(sentLastHour),
            limit: String(config.rateLimitPerHour),
          }),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const message = await composeMessage(config, input, now);

      try {
        await deps.sendRaw(config, message);
      } catch (error) {
        logger.error("System mailbox SMTP send failed", parseError(error));
        return fail({
          message: t("errors.smtpFailed", { error: parseError(error).message }),
          errorType: ErrorResponseTypes.EMAIL_ERROR,
        });
      }

      // Delivered. From here on nothing may turn the send into a failure.
      try {
        await deps.recordSent(config, message, userId);
      } catch (error) {
        logger.error("System mailbox send not recorded", parseError(error));
      }

      let sentFolder: string | null = null;
      try {
        sentFolder = await deps.appendSent(config, message);
      } catch (error) {
        logger.warn("System mailbox Sent append failed", {
          error: parseError(error).message,
        });
      }

      return success({
        messageId: message.messageId,
        from: message.from,
        toAddress: message.to,
        storedInSent: sentFolder !== null,
        sentFolder,
        sentLastHour: sentLastHour + 1,
        rateLimitPerHour: config.rateLimitPerHour,
      });
    } catch (error) {
      logger.error("System mailbox send failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async listInbox(
    options: { limit: number; unreadOnly: boolean },
    logger: EndpointLogger,
    t: SystemMailboxT,
  ): Promise<
    ResponseType<{ address: string; messages: InboxMessageSummary[] }>
  > {
    const configResult = await SystemMailboxRepository.getConfig(logger, t);
    if (!configResult.success) {
      return configResult;
    }
    try {
      const limit = Math.min(Math.max(options.limit, 1), MAX_INBOX_LIMIT);
      const messages = await SystemMailboxRepository.deps.listInbox(
        configResult.data,
        { limit, unreadOnly: options.unreadOnly },
      );
      return success({ address: configResult.data.address, messages });
    } catch (error) {
      logger.error("System mailbox inbox failed", parseError(error));
      return fail({
        message: t("errors.imapFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  static async readMessage(
    uid: number,
    logger: EndpointLogger,
    t: SystemMailboxT,
  ): Promise<ResponseType<InboxMessageFull>> {
    const configResult = await SystemMailboxRepository.getConfig(logger, t);
    if (!configResult.success) {
      return configResult;
    }
    try {
      const message = await SystemMailboxRepository.deps.readMessage(
        configResult.data,
        uid,
      );
      if (!message) {
        return fail({
          message: t("errors.messageNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success(message);
    } catch (error) {
      logger.error("System mailbox read failed", parseError(error));
      return fail({
        message: t("errors.imapFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
