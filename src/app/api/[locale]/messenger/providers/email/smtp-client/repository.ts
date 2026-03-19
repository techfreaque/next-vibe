/**
 * SMTP Client Repository
 * Routes all email sending through messenger_accounts (channel='EMAIL', provider='SMTP').
 * The old smtp_accounts table is no longer used for sending — only messenger_accounts is.
 */

import "server-only";

import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type { Address } from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { MessengerAccount } from "../../../accounts/db";
import { messengerAccounts } from "../../../accounts/db";
import {
  MessengerAccountStatus,
  MessengerHealthStatus,
  MessengerProvider,
} from "../../../accounts/enum";
import { emails } from "../../../messages/db";
import { MessageStatus, MessageType } from "../../../messages/enum";
import { SMTP_ERROR_MESSAGES } from "./constants";
import { CampaignType } from "../../../accounts/enum";
import type { CampaignTypeValue } from "../../../accounts/enum";
import { EmailSecurityType } from "../enum";
import type { SmtpClientT } from "./i18n";
import { MessageChannel } from "../../../accounts/enum";
import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import type { Countries, Languages } from "@/i18n/core/config";

export interface SmtpSelectionCriteria {
  campaignType: typeof CampaignTypeValue;
  emailJourneyVariant: typeof EmailJourneyVariantValues | null;
  emailCampaignStage: typeof EmailCampaignStageValues | null;
  country: Countries;
  language: Languages;
}

export interface SmtpSendParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  unsubscribeUrl?: string;
  senderName: string;
  selectionCriteria: SmtpSelectionCriteria;
  skipRateLimitCheck?: boolean;
  leadId?: string;
  campaignId?: string;
}

export interface SmtpSendResult {
  messageId: string;
  accountId: string;
  accountName: string;
  accepted: string[];
  rejected: string[];
  response: string;
}

export interface SmtpCapacityResponseOutput {
  totalCapacity: number;
  remainingCapacity: number;
}

/**
 * Normalised SMTP-specific shape extracted from a MessengerAccount row.
 * All types are inferred directly from MessengerAccount — no duplication.
 */
interface SmtpAccountShape {
  id: MessengerAccount["id"];
  name: MessengerAccount["name"];
  host: string;
  port: number;
  securityType: NonNullable<MessengerAccount["smtpSecurityType"]>;
  username: string;
  password: string;
  fromEmail: string;
  connectionTimeout: MessengerAccount["smtpConnectionTimeout"];
  rateLimitPerHour: MessengerAccount["smtpRateLimitPerHour"];
  status: MessengerAccount["status"];
  isDefault: MessengerAccount["isDefault"];
  priority: MessengerAccount["priority"];
  campaignTypes: MessengerAccount["campaignTypes"];
  emailJourneyVariants: MessengerAccount["emailJourneyVariants"];
  emailCampaignStages: MessengerAccount["emailCampaignStages"];
  countries: MessengerAccount["countries"];
  languages: MessengerAccount["languages"];
  isExactMatch: MessengerAccount["isExactMatch"];
  weight: MessengerAccount["weight"];
  isFailover: MessengerAccount["isFailover"];
  lastUsedAt: MessengerAccount["lastUsedAt"];
}

interface TestConnectionResult {
  success: boolean;
  message: TranslationKey;
}

/**
 * SMTP Repository — reads from messenger_accounts (channel=EMAIL, provider=SMTP)
 */
export class SmtpRepository {
  private static transportCache = new Map<
    string,
    Transporter<SMTPTransport.SentMessageInfo>
  >();

  private static readonly SMTP_ACTIVE_CONDITIONS = [
    eq(messengerAccounts.channel, MessageChannel.EMAIL),
    eq(messengerAccounts.provider, MessengerProvider.SMTP),
    eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
  ] as const;

  private static toSmtpShape(row: MessengerAccount): SmtpAccountShape {
    return {
      id: row.id,
      name: row.name,
      host: row.smtpHost ?? "",
      port: row.smtpPort ?? 587,
      securityType: row.smtpSecurityType ?? EmailSecurityType.STARTTLS,
      username: row.smtpUsername ?? "",
      password: row.smtpPassword ?? "",
      fromEmail: row.smtpFromEmail ?? "",
      connectionTimeout: row.smtpConnectionTimeout,
      rateLimitPerHour: row.smtpRateLimitPerHour,
      status: row.status,
      isDefault: row.isDefault,
      priority: row.priority,
      campaignTypes: row.campaignTypes,
      emailJourneyVariants: row.emailJourneyVariants,
      emailCampaignStages: row.emailCampaignStages,
      countries: row.countries,
      languages: row.languages,
      isExactMatch: row.isExactMatch,
      weight: row.weight,
      isFailover: row.isFailover,
      lastUsedAt: row.lastUsedAt,
    };
  }

  /**
   * Send email using database-configured SMTP account with retry and fallback support
   */
  static async sendEmail(
    data: SmtpSendParams,
    user: JwtPayloadType,
    t: SmtpClientT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpSendResult>> {
    try {
      logger.info("Sending email via SMTP service", {
        to: data.to,
        subject: data.subject,
        userId: user.id,
      });

      const primaryAccount = await this.getSmtpAccountWithCriteria(
        data.selectionCriteria,
        logger,
      );
      if (!primaryAccount) {
        const isLeadCampaign =
          data.selectionCriteria.campaignType === CampaignType.LEAD_CAMPAIGN;

        if (isLeadCampaign) {
          return fail({
            message: t("sending.errors.no_account.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              campaignType: data.selectionCriteria.campaignType,
              emailJourneyVariant:
                data.selectionCriteria.emailJourneyVariant || "null",
              emailCampaignStage:
                data.selectionCriteria.emailCampaignStage || "null",
              country: data.selectionCriteria.country,
              language: data.selectionCriteria.language,
            },
          });
        }
        return fail({
          message: t("sending.errors.no_account.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            campaignType: data.selectionCriteria.campaignType,
          },
        });
      }

      const primaryResult = await SmtpRepository.attemptEmailSendWithRetry(
        data,
        primaryAccount,
        false,
        logger,
        t,
      );
      if (primaryResult.success) {
        return primaryResult;
      }

      logger.info(
        "Primary SMTP account failed after retries, trying fallback",
        {
          to: data.to,
          primaryAccountId: primaryAccount.id,
          primaryError: primaryResult.message,
        },
      );

      const fallbackAccount = await this.getFallbackSmtpAccount(logger);
      if (!fallbackAccount || fallbackAccount.id === primaryAccount.id) {
        return primaryResult;
      }

      const fallbackResult = await SmtpRepository.attemptEmailSendWithRetry(
        data,
        fallbackAccount,
        true,
        logger,
        t,
      );
      if (fallbackResult.success) {
        return fallbackResult;
      }

      logger.error("All SMTP accounts failed", {
        to: data.to,
        primaryAccountId: primaryAccount.id,
        fallbackAccountId: fallbackAccount.id,
        primaryError: primaryResult.message,
        fallbackError: fallbackResult.message,
      });

      return fallbackResult;
    } catch (error) {
      logger.error("Critical error in email sending", parseError(error));
      return fail({
        message: t("sending.errors.server.title"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Get total sending capacity across all active SMTP accounts
   */
  static async getTotalSendingCapacity(
    data: Record<string, never>,
    user: JwtPayloadType,
    t: SmtpClientT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpCapacityResponseOutput>> {
    try {
      logger.info("Getting total sending capacity", { userId: user.id, data });

      const rows = await db
        .select()
        .from(messengerAccounts)
        .where(and(...SmtpRepository.SMTP_ACTIVE_CONDITIONS));

      if (rows.length === 0) {
        return success({ totalCapacity: 0, remainingCapacity: 0 });
      }

      const accounts = rows.map((r) => SmtpRepository.toSmtpShape(r));
      let totalCapacity = 0;
      let totalRemainingCapacity = 0;

      for (const account of accounts) {
        const accountCapacity = account.rateLimitPerHour || 0;
        totalCapacity += accountCapacity;

        const rateLimitCheck = await SmtpRepository.checkRateLimit(
          account,
          logger,
          t,
        );
        if (rateLimitCheck.success) {
          totalRemainingCapacity += rateLimitCheck.data.remainingCapacity;
        }
      }

      return success({
        totalCapacity,
        remainingCapacity: totalRemainingCapacity,
      });
    } catch (error) {
      logger.error("Error getting total sending capacity", parseError(error));
      return fail({
        message: t("sending.errors.capacity.title"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Test SMTP account connection (by messenger_accounts ID)
   */
  static async testConnection(
    data: { accountId: string },
    user: JwtPayloadType,
    t: SmtpClientT,
    logger: EndpointLogger,
  ): Promise<ResponseType<TestConnectionResult>> {
    try {
      logger.info("Testing SMTP connection", {
        accountId: data.accountId,
        userId: user.id,
      });

      const [row] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, data.accountId))
        .limit(1);

      if (!row) {
        return fail({
          message: t("sending.errors.no_account.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { accountId: data.accountId },
        });
      }

      const account = SmtpRepository.toSmtpShape(row);
      const transportResult = await SmtpRepository.getTransport(
        account,
        logger,
        t,
      );
      if (!transportResult.success) {
        return fail({
          message: transportResult.message,
          errorType:
            transportResult.errorType || ErrorResponseTypes.EMAIL_ERROR,
          messageParams: transportResult.messageParams,
          cause: transportResult,
        });
      }

      await transportResult.data.verify();
      await SmtpRepository.updateAccountHealth(data.accountId, true, logger);

      return success({ success: true, message: t("enums.testResult.success") });
    } catch (error) {
      await SmtpRepository.updateAccountHealth(
        data.accountId,
        false,
        logger,
        parseError(error).message,
      );

      return fail({
        message: t("sending.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get SMTP account using enhanced selection criteria (from messenger_accounts)
   */
  private static async getSmtpAccountWithCriteria(
    selectionCriteria: SmtpSelectionCriteria,
    logger: EndpointLogger,
  ): Promise<SmtpAccountShape | null> {
    try {
      const sqlConditions = [...SmtpRepository.SMTP_ACTIVE_CONDITIONS];

      const isLeadCampaign =
        selectionCriteria?.campaignType === CampaignType.LEAD_CAMPAIGN;

      if (selectionCriteria?.campaignType) {
        sqlConditions.push(
          sql`${messengerAccounts.campaignTypes} @> ${JSON.stringify([selectionCriteria.campaignType])}`,
        );
      }

      if (isLeadCampaign) {
        if (selectionCriteria?.emailJourneyVariant) {
          sqlConditions.push(
            sql`${messengerAccounts.emailJourneyVariants} @> ${JSON.stringify([selectionCriteria.emailJourneyVariant])}`,
          );
        }
        if (selectionCriteria?.emailCampaignStage) {
          sqlConditions.push(
            sql`${messengerAccounts.emailCampaignStages} @> ${JSON.stringify([selectionCriteria.emailCampaignStage])}`,
          );
        }
        if (selectionCriteria?.country) {
          sqlConditions.push(
            sql`${messengerAccounts.countries} @> ${JSON.stringify([selectionCriteria.country])}`,
          );
        }
        if (selectionCriteria?.language) {
          sqlConditions.push(
            sql`${messengerAccounts.languages} @> ${JSON.stringify([selectionCriteria.language])}`,
          );
        }
      } else {
        if (selectionCriteria?.emailJourneyVariant) {
          sqlConditions.push(
            sql`${messengerAccounts.emailJourneyVariants} @> ${JSON.stringify([selectionCriteria.emailJourneyVariant])}`,
          );
        }
        if (selectionCriteria?.emailCampaignStage) {
          sqlConditions.push(
            sql`${messengerAccounts.emailCampaignStages} @> ${JSON.stringify([selectionCriteria.emailCampaignStage])}`,
          );
        }
        if (selectionCriteria?.country) {
          sqlConditions.push(
            sql`${messengerAccounts.countries} @> ${JSON.stringify([selectionCriteria.country])}`,
          );
        }
        if (selectionCriteria?.language) {
          sqlConditions.push(
            sql`${messengerAccounts.languages} @> ${JSON.stringify([selectionCriteria.language])}`,
          );
        }
      }

      const rows = await db
        .select()
        .from(messengerAccounts)
        .where(and(...sqlConditions))
        .orderBy(
          desc(messengerAccounts.priority),
          asc(messengerAccounts.lastUsedAt),
        );

      if (rows.length === 0) {
        if (isLeadCampaign) {
          logger.error(
            "No SMTP accounts match lead campaign criteria - strict matching required",
          );
          return null;
        }

        logger.info("No accounts match criteria, trying fallback");

        const fallbackRows = await db
          .select()
          .from(messengerAccounts)
          .where(and(...SmtpRepository.SMTP_ACTIVE_CONDITIONS))
          .orderBy(
            desc(messengerAccounts.isDefault),
            desc(messengerAccounts.priority),
          )
          .limit(1);

        if (fallbackRows.length === 0) {
          logger.error("No active SMTP messenger accounts available");
          return null;
        }

        logger.info("Using fallback SMTP account", {
          accountId: fallbackRows[0].id,
          accountName: fallbackRows[0].name,
        });

        return SmtpRepository.toSmtpShape(fallbackRows[0]);
      }

      return SmtpRepository.toSmtpShape(rows[0]);
    } catch (error) {
      logger.error(
        "Error getting SMTP account with criteria",
        parseError(error),
      );
      return null;
    }
  }

  /**
   * Get any available SMTP account as fallback
   */
  private static async getFallbackSmtpAccount(
    logger: EndpointLogger,
  ): Promise<SmtpAccountShape | null> {
    try {
      const rows = await db
        .select()
        .from(messengerAccounts)
        .where(and(...SmtpRepository.SMTP_ACTIVE_CONDITIONS))
        .orderBy(
          desc(messengerAccounts.isDefault),
          desc(messengerAccounts.priority),
        )
        .limit(1);

      if (rows.length === 0) {
        logger.error(
          "No active SMTP messenger accounts available for fallback",
        );
        return null;
      }

      logger.info("Using fallback SMTP account", {
        accountId: rows[0].id,
        accountName: rows[0].name,
      });

      return SmtpRepository.toSmtpShape(rows[0]);
    } catch (error) {
      logger.error("Error getting fallback SMTP account", parseError(error));
      return null;
    }
  }

  /**
   * Create or get cached SMTP transport
   */
  private static async getTransport(
    account: SmtpAccountShape,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<ResponseType<Transporter<SMTPTransport.SentMessageInfo>>> {
    const cacheKey = account.id;

    if (SmtpRepository.transportCache.has(cacheKey)) {
      const cached = SmtpRepository.transportCache.get(cacheKey);
      if (cached) {
        return success(cached);
      }
    }

    try {
      const transportConfig: SMTPTransport.Options = {
        host: account.host,
        port: account.port,
        secure: account.securityType === EmailSecurityType.SSL,
        auth: {
          user: account.username,
          pass: account.password,
        },
        connectionTimeout: account.connectionTimeout || 30000,
      };

      if (account.securityType === EmailSecurityType.STARTTLS) {
        transportConfig.requireTLS = true;
      }

      const transport = createTransport(transportConfig);
      await transport.verify();

      SmtpRepository.transportCache.set(cacheKey, transport);
      return success(transport);
    } catch (error) {
      logger.error("Error creating SMTP transport", {
        accountId: account.id,
        accountName: account.name,
        error: parseError(error).message,
      });

      await SmtpRepository.updateAccountHealth(
        account.id,
        false,
        logger,
        parseError(error).message,
      );

      return fail({
        message: t("sending.errors.server.title"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          accountId: account.id,
          accountName: account.name,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Attempt to send email with retry logic for connection issues
   */
  private static async attemptEmailSendWithRetry(
    params: SmtpSendParams,
    account: SmtpAccountShape,
    isFallback: boolean,
    logger: EndpointLogger,
    t: SmtpClientT,
    maxRetries = 2,
  ): Promise<ResponseType<SmtpSendResult>> {
    let lastError: ResponseType<SmtpSendResult> | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info("Attempting email send", {
          to: params.to,
          accountId: account.id,
          accountName: account.name,
          attempt,
          maxRetries,
          isFallback,
        });

        const result = await this.performEmailSend(params, account, logger, t);

        if (result.success) {
          if (attempt > 1) {
            logger.info("Email send succeeded after retry", {
              to: params.to,
              accountId: account.id,
              attempt,
              previousErrors: lastError?.message,
            });
          }
          return result;
        }

        lastError = result;

        const isRetryable = this.isRetryableError(result.message);
        if (!isRetryable || attempt === maxRetries) {
          logger.info(
            "Email send failed - not retryable or max retries reached",
            {
              to: params.to,
              accountId: account.id,
              attempt,
              maxRetries,
              error: result.message,
              isRetryable,
            },
          );
          break;
        }

        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        logger.info("Retrying email send after delay", {
          to: params.to,
          accountId: account.id,
          attempt,
          delayMs,
          error: result.message,
        });

        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });
      } catch (error) {
        const errorMessage = parseError(error).message;
        lastError = fail({
          message: t("sending.errors.server.title"),
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: {
            error: errorMessage,
            accountId: account.id,
            attempt: attempt.toString(),
          },
        });

        const isRetryable = this.isRetryableError(errorMessage);
        if (!isRetryable || attempt === maxRetries) {
          break;
        }

        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
    }

    return (
      lastError ||
      fail({
        message: t("sending.errors.server.title"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: { accountId: account.id },
      })
    );
  }

  private static isRetryableError(errorMessage: string): boolean {
    const retryablePatterns =
      /greeting|timeout|connect|refused|unreachable|reset|temporary/i;
    return retryablePatterns.test(errorMessage);
  }

  /**
   * Perform the actual email sending with an account
   */
  private static async performEmailSend(
    params: SmtpSendParams,
    account: SmtpAccountShape,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<ResponseType<SmtpSendResult>> {
    try {
      if (!params.skipRateLimitCheck) {
        const rateLimitCheck = await SmtpRepository.checkRateLimit(
          account,
          logger,
          t,
        );
        if (!rateLimitCheck.success) {
          return fail({
            message: rateLimitCheck.message,
            errorType: rateLimitCheck.errorType,
            messageParams: rateLimitCheck.messageParams,
            cause: rateLimitCheck,
          });
        }

        if (rateLimitCheck.data.remainingCapacity < 10) {
          logger.info("Rate limit approaching", {
            accountId: account.id,
            accountName: account.name,
            remainingCapacity: rateLimitCheck.data.remainingCapacity,
            currentUsage: rateLimitCheck.data.currentUsage,
            limit: account.rateLimitPerHour,
          });
        }
      }

      const transportResult = await SmtpRepository.getTransport(
        account,
        logger,
        t,
      );
      if (!transportResult.success) {
        return fail({
          message: transportResult.message,
          errorType:
            transportResult.errorType || ErrorResponseTypes.EMAIL_ERROR,
          messageParams: transportResult.messageParams,
          cause: transportResult,
        });
      }

      const transport = transportResult.data;

      const headers: Record<string, string> = {};
      if (params.unsubscribeUrl) {
        headers["List-Unsubscribe"] = `<${params.unsubscribeUrl}>`;
        headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
      }

      const result = await transport.sendMail({
        from: `${params.senderName} <${account.fromEmail}>`,
        to: params.toName ? `${params.toName} <${params.to}>` : params.to,
        replyTo: params.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
        headers,
      });

      if (result.rejected && result.rejected.length > 0) {
        const rejectedReason =
          typeof result.rejected[0] === "string"
            ? result.rejected[0]
            : SMTP_ERROR_MESSAGES.CLIENT_ERROR;

        await SmtpRepository.updateAccountHealth(
          account.id,
          false,
          logger,
          rejectedReason,
        );

        return fail({
          message: t("sending.errors.rejected.title"),
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: { recipient: params.to, reason: rejectedReason },
        });
      }

      if (!result.accepted || result.accepted.length === 0) {
        await SmtpRepository.updateAccountHealth(
          account.id,
          false,
          logger,
          SMTP_ERROR_MESSAGES.CLIENT_ERROR,
        );

        return fail({
          message: t("sending.errors.no_recipients.title"),
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: { recipient: params.to },
        });
      }

      if (!params.campaignId) {
        await this.recordEmailInDatabase(
          {
            subject: params.subject,
            recipientEmail: params.to,
            recipientName: params.toName,
            senderEmail: account.fromEmail,
            senderName: params.senderName,
            accountId: account.id,
            messageId: result.messageId,
            campaignType: params.selectionCriteria?.campaignType,
            emailJourneyVariant: params.selectionCriteria?.emailJourneyVariant,
            emailCampaignStage: params.selectionCriteria?.emailCampaignStage,
            leadId: params.leadId,
            campaignId: params.campaignId,
            templateName:
              params.selectionCriteria?.emailJourneyVariant &&
              params.selectionCriteria?.emailCampaignStage
                ? `${params.selectionCriteria.emailJourneyVariant}_${params.selectionCriteria.emailCampaignStage}`
                : undefined,
          },
          logger,
        );
      }

      await this.updateAccountUsage(account.id, logger);
      await SmtpRepository.updateAccountHealth(account.id, true, logger);

      logger.info("Email sent successfully", {
        messageId: result.messageId,
        accountId: account.id,
        accountName: account.name,
      });

      return success({
        messageId: result.messageId,
        accountId: account.id,
        accountName: account.name,
        accepted: result.accepted.map((addr: string | Address) =>
          typeof addr === "string" ? addr : addr.address,
        ),
        rejected: result.rejected.map((addr: string | Address) =>
          typeof addr === "string" ? addr : addr.address,
        ),
        response: result.response,
      });
    } catch (error) {
      logger.error("Error performing email send", parseError(error));

      const errorMessage = parseError(error).message;
      const isConnectionError =
        /greeting|timeout|connect|refused|unreachable/i.test(errorMessage);
      if (isConnectionError) {
        await SmtpRepository.updateAccountHealth(
          account.id,
          false,
          logger,
          errorMessage,
        );
      }

      return fail({
        message: t("sending.errors.server.title"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          error: errorMessage,
          accountId: account.id,
          accountName: account.name,
        },
      });
    }
  }

  /**
   * Check rate limits for account with database validation
   */
  private static async checkRateLimit(
    account: SmtpAccountShape,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<
    ResponseType<{
      canSend: boolean;
      remainingCapacity: number;
      currentUsage: number;
    }>
  > {
    try {
      if (!account.rateLimitPerHour) {
        return success({
          canSend: true,
          remainingCapacity: Number.MAX_SAFE_INTEGER,
          currentUsage: 0,
        });
      }

      const currentHour = new Date();
      currentHour.setMinutes(0, 0, 0);

      const emailsCount = await db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(emails)
        .where(
          and(
            eq(emails.accountId, account.id),
            gte(emails.sentAt, currentHour),
            eq(emails.status, MessageStatus.SENT),
          ),
        );

      const emailsSentThisHour = emailsCount[0]?.count || 0;
      const remainingCapacity = Math.max(
        0,
        account.rateLimitPerHour - emailsSentThisHour,
      );
      const canSend = remainingCapacity > 0;

      if (!canSend) {
        return fail({
          message: t("sending.errors.rate_limit.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            accountName: account.name,
            limit: account.rateLimitPerHour.toString(),
            current: emailsSentThisHour.toString(),
            timeWindow: "hour",
            remainingCapacity: "0",
          },
        });
      }

      return success({
        canSend,
        remainingCapacity,
        currentUsage: emailsSentThisHour,
      });
    } catch (error) {
      logger.error("Error checking rate limit", parseError(error));
      return success({ canSend: true, remainingCapacity: 10, currentUsage: 0 });
    }
  }

  /**
   * Record email in database for tracking and rate limiting
   */
  private static async recordEmailInDatabase(
    emailData: {
      subject: string;
      recipientEmail: string;
      recipientName?: string;
      senderEmail: string;
      senderName: string;
      accountId: string;
      messageId: string;
      campaignType: (typeof CampaignType)[keyof typeof CampaignType] | null;
      emailJourneyVariant: string | null;
      emailCampaignStage: string | null;
      leadId?: string;
      campaignId?: string;
      templateName?: string;
    },
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      await db.insert(emails).values({
        subject: emailData.subject,
        recipientEmail: emailData.recipientEmail,
        recipientName: emailData.recipientName,
        senderEmail: emailData.senderEmail,
        senderName: emailData.senderName,
        accountId: emailData.accountId,
        messageId: emailData.messageId,
        type: SmtpRepository.getEmailTypeFromCampaign(emailData.campaignType),
        status: MessageStatus.SENT,
        sentAt: new Date(),
        templateName:
          emailData.templateName ||
          `${emailData.emailJourneyVariant}_${emailData.emailCampaignStage}`,
        leadId: emailData.leadId,
        metadata: {
          campaignType: emailData.campaignType?.toString(),
          emailJourneyVariant: emailData.emailJourneyVariant?.toString(),
          emailCampaignStage: emailData.emailCampaignStage?.toString(),
          campaignId: emailData.campaignId,
        },
      });
    } catch (error) {
      logger.error("Error recording email in database", parseError(error));
    }
  }

  private static getEmailTypeFromCampaign(
    campaignType: (typeof CampaignType)[keyof typeof CampaignType] | null,
  ): (typeof MessageType)[keyof typeof MessageType] {
    switch (campaignType) {
      case CampaignType.LEAD_CAMPAIGN:
        return MessageType.LEAD_CAMPAIGN;
      case CampaignType.NEWSLETTER:
      case CampaignType.SIGNUP_NURTURE:
      case CampaignType.RETENTION:
      case CampaignType.WINBACK:
        return MessageType.MARKETING;
      case CampaignType.TRANSACTIONAL:
        return MessageType.TRANSACTIONAL;
      case CampaignType.NOTIFICATION:
        return MessageType.NOTIFICATION;
      case CampaignType.SYSTEM:
        return MessageType.SYSTEM;
      default:
        return MessageType.TRANSACTIONAL;
    }
  }

  /**
   * Update account usage statistics in messenger_accounts
   */
  private static async updateAccountUsage(
    accountId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      await db
        .update(messengerAccounts)
        .set({
          messagesSentToday: sql`messages_sent_today + 1`,
          messagesSentTotal: sql`messages_sent_total + 1`,
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(messengerAccounts.id, accountId));
    } catch (error) {
      logger.error("Error updating account usage", parseError(error));
    }
  }

  /**
   * Update account health status in messenger_accounts
   */
  static async updateAccountHealth(
    accountId: string,
    isSuccess: boolean,
    logger: EndpointLogger,
    errorMessage?: string,
  ): Promise<void> {
    try {
      if (isSuccess) {
        await db
          .update(messengerAccounts)
          .set({
            healthStatus: MessengerHealthStatus.HEALTHY,
            consecutiveFailures: 0,
            lastHealthCheck: new Date(),
            lastFailureAt: null,
            lastFailureReason: null,
            updatedAt: new Date(),
          })
          .where(eq(messengerAccounts.id, accountId));
      } else {
        await db
          .update(messengerAccounts)
          .set({
            healthStatus: MessengerHealthStatus.UNHEALTHY,
            consecutiveFailures: sql`consecutive_failures + 1`,
            lastHealthCheck: new Date(),
            lastFailureAt: new Date(),
            lastFailureReason: errorMessage,
            updatedAt: new Date(),
          })
          .where(eq(messengerAccounts.id, accountId));
      }
    } catch (error) {
      logger.error("Error updating account health", parseError(error));
    }
  }

  /**
   * Close all cached transports
   */
  async closeAllTransports(): Promise<void> {
    for (const [, transport] of SmtpRepository.transportCache.entries()) {
      try {
        await new Promise<void>((resolve) => {
          transport.close();
          resolve();
        });
      } catch {
        // Ignore transport close errors
      }
    }
    SmtpRepository.transportCache.clear();
  }
}
