/**
 * SMTP Sending Repository
 * Production-ready SMTP client using database configuration
 */

import "server-only";

import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type { Address } from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { emailCampaigns } from "../../../leads/db";
import type { JwtPayloadType } from "../../../user/auth/types";
import { emails } from "../../messages/db";
import { EmailStatus, EmailType } from "../../messages/enum";
import type { SmtpAccount } from "../db";
import { smtpAccounts } from "../db";
import {
  CampaignType,
  SmtpAccountStatus,
  SmtpHealthStatus,
  SmtpSecurityType,
} from "../enum";
import type {
  SmtpCapacityRequestOutput,
  SmtpCapacityResponseOutput,
  SmtpSelectionCriteria,
  SmtpSendParams,
  SmtpSendRequestOutput,
  SmtpSendResponseOutput,
  SmtpSendResult,
} from "./types";
/**
 * SMTP Sending Repository Interface
 */
export interface SmtpSendingRepository {
  sendEmail(
    data: SmtpSendRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpSendResponseOutput>>;

  getTotalSendingCapacity(
    data: SmtpCapacityRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpCapacityResponseOutput>>;
}

/**
 * SMTP Sending Repository Implementation
 */
export class SmtpSendingRepositoryImpl implements SmtpSendingRepository {
  private transportCache = new Map<
    string,
    Transporter<SMTPTransport.SentMessageInfo>
  >();

  /**
   * Get SMTP account using enhanced selection criteria
   */
  private async getSmtpAccountWithCriteria(
    selectionCriteria: SmtpSelectionCriteria,
    logger: EndpointLogger,
  ): Promise<SmtpAccount | null> {
    try {
      // Build SQL conditions based on selection criteria
      const sqlConditions = [eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE)];

      // For lead campaigns, we must enforce strict criteria matching
      // All criteria must be explicitly set on the SMTP account
      const isLeadCampaign =
        selectionCriteria?.campaignType === CampaignType.LEAD_CAMPAIGN;

      // Campaign type is always required and must be explicitly set
      if (selectionCriteria?.campaignType) {
        sqlConditions.push(
          sql`${smtpAccounts.campaignTypes} @> ${JSON.stringify([selectionCriteria.campaignType])}`,
        );
      }

      // For lead campaigns, all criteria must be explicitly matched
      if (isLeadCampaign) {
        // Email journey variant must be explicitly set if provided
        if (selectionCriteria?.emailJourneyVariant) {
          sqlConditions.push(
            sql`${smtpAccounts.emailJourneyVariants} @> ${JSON.stringify([selectionCriteria.emailJourneyVariant])}`,
          );
        }

        // Email campaign stage must be explicitly set if provided
        if (selectionCriteria?.emailCampaignStage) {
          sqlConditions.push(
            sql`${smtpAccounts.emailCampaignStages} @> ${JSON.stringify([selectionCriteria.emailCampaignStage])}`,
          );
        }

        // Country must be explicitly set
        if (selectionCriteria?.country) {
          sqlConditions.push(
            sql`${smtpAccounts.countries} @> ${JSON.stringify([selectionCriteria.country])}`,
          );
        }

        // Language must be explicitly set
        if (selectionCriteria?.language) {
          sqlConditions.push(
            sql`${smtpAccounts.languages} @> ${JSON.stringify([selectionCriteria.language])}`,
          );
        }
      } else {
        // For non-lead campaigns, use the original logic with optional matching
        if (selectionCriteria?.emailJourneyVariant) {
          sqlConditions.push(
            sql`${smtpAccounts.emailJourneyVariants} @> ${JSON.stringify([selectionCriteria.emailJourneyVariant])}`,
          );
        }

        if (selectionCriteria?.emailCampaignStage) {
          sqlConditions.push(
            sql`${smtpAccounts.emailCampaignStages} @> ${JSON.stringify([selectionCriteria.emailCampaignStage])}`,
          );
        }

        if (selectionCriteria?.country) {
          sqlConditions.push(
            sql`${smtpAccounts.countries} @> ${JSON.stringify([selectionCriteria.country])}`,
          );
        }

        if (selectionCriteria?.language) {
          sqlConditions.push(
            sql`${smtpAccounts.languages} @> ${JSON.stringify([selectionCriteria.language])}`,
          );
        }
      }

      // Get all active accounts that match the selection criteria
      const accounts = await db
        .select()
        .from(smtpAccounts)
        .where(and(...sqlConditions))
        .orderBy(desc(smtpAccounts.priority), asc(smtpAccounts.lastUsedAt));

      if (accounts.length === 0) {
        // For lead campaigns, NO fallback is allowed - strict criteria matching required
        if (isLeadCampaign) {
          // Note: Would use logger here if passed to private method
          logger.error(
            "No SMTP accounts match lead campaign criteria - strict matching required",
          );
          return null;
        }

        // For non-lead campaigns, try fallback to any active account
        // Note: Would use logger here if passed to private method
        logger.info("No accounts match criteria, trying fallback");

        const fallbackAccounts = await db
          .select()
          .from(smtpAccounts)
          .where(eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE))
          .orderBy(desc(smtpAccounts.isDefault), desc(smtpAccounts.priority))
          .limit(1);

        if (fallbackAccounts.length === 0) {
          logger.error("No active SMTP accounts available");
          return null;
        }

        logger.info("Using fallback SMTP account", {
          accountId: fallbackAccounts[0].id,
          accountName: fallbackAccounts[0].name,
        });

        return fallbackAccounts[0];
      }

      // If no selection criteria provided, return the first account (highest priority)
      if (!selectionCriteria) {
        return accounts[0];
      }

      // Since we've already filtered at SQL level, all accounts should match
      // Now apply advanced selection logic based on exact match requirements and weights
      const accountsWithScoring = accounts.map((account) => {
        let score = account.weight || 1;
        let exactMatchCount = 0;
        let totalCriteria = 0;

        // Count how many criteria this account exactly matches
        if (selectionCriteria.campaignType) {
          totalCriteria++;
          if (account.campaignTypes?.includes(selectionCriteria.campaignType)) {
            exactMatchCount++;
            score += 10; // Bonus for exact campaign type match
          }
        }

        if (selectionCriteria.emailJourneyVariant) {
          totalCriteria++;
          if (
            account.emailJourneyVariants?.includes(
              selectionCriteria.emailJourneyVariant as (typeof account.emailJourneyVariants)[number],
            )
          ) {
            exactMatchCount++;
            score += 8; // Bonus for exact journey variant match
          }
        }

        if (selectionCriteria.emailCampaignStage) {
          totalCriteria++;
          if (
            account.emailCampaignStages?.includes(
              selectionCriteria.emailCampaignStage as (typeof account.emailCampaignStages)[number],
            )
          ) {
            exactMatchCount++;
            score += 6; // Bonus for exact campaign stage match
          }
        }

        if (selectionCriteria.country) {
          totalCriteria++;
          if (account.countries?.includes(selectionCriteria.country)) {
            exactMatchCount++;
            score += 4; // Bonus for exact country match
          }
        }

        if (selectionCriteria.language) {
          totalCriteria++;
          if (account.languages?.includes(selectionCriteria.language)) {
            exactMatchCount++;
            score += 2; // Bonus for exact language match
          }
        }

        // Calculate match percentage
        const matchPercentage =
          totalCriteria > 0 ? exactMatchCount / totalCriteria : 1;

        // If exact match is required, the account must match ALL criteria
        if (account.isExactMatch && matchPercentage < 1) {
          score = 0; // Disqualify this account
        } else {
          score *= matchPercentage; // Weight by match quality
        }

        return {
          account,
          score,
          matchPercentage,
          exactMatchCount,
        };
      });

      // Filter out disqualified accounts (score = 0)
      const qualifiedAccounts = accountsWithScoring.filter(
        (item) => item.score > 0,
      );

      if (qualifiedAccounts.length === 0) {
        return null;
      }

      // Sort by score (descending) and priority (descending)
      qualifiedAccounts.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (b.account.priority || 0) - (a.account.priority || 0);
      });

      // Weighted random selection from top candidates
      const topCandidates = qualifiedAccounts.slice(
        0,
        Math.min(3, qualifiedAccounts.length),
      );
      const totalWeight = topCandidates.reduce(
        (sum, item) => sum + item.score,
        0,
      );

      if (totalWeight === 0) {
        return topCandidates[0].account;
      }

      const random = Math.random() * totalWeight;
      let currentWeight = 0;

      for (const item of topCandidates) {
        currentWeight += item.score;
        if (random <= currentWeight) {
          return item.account;
        }
      }

      // Fallback to first candidate
      return topCandidates[0].account;
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
  private async getFallbackSmtpAccount(
    logger: EndpointLogger,
  ): Promise<SmtpAccount | null> {
    try {
      const fallbackAccounts = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE))
        .orderBy(desc(smtpAccounts.isDefault), desc(smtpAccounts.priority))
        .limit(1);

      if (fallbackAccounts.length === 0) {
        logger.error("No active SMTP accounts available for fallback");
        return null;
      }

      logger.info("Using fallback SMTP account", {
        accountId: fallbackAccounts[0].id,
        accountName: fallbackAccounts[0].name,
      });

      return fallbackAccounts[0];
    } catch (error) {
      logger.error("Error getting fallback SMTP account", parseError(error));
      return null;
    }
  }

  /**
   * Create or get cached SMTP transport
   */
  private async getTransport(
    account: SmtpAccount,
    logger: EndpointLogger,
  ): Promise<Transporter<SMTPTransport.SentMessageInfo>> {
    const cacheKey = account.id;

    if (this.transportCache.has(cacheKey)) {
      const cachedTransport = this.transportCache.get(cacheKey);
      if (cachedTransport) {
        return cachedTransport;
      }
    }

    try {
      const transportConfig: SMTPTransport.Options = {
        host: account.host,
        port: account.port,
        secure: account.securityType === SmtpSecurityType.SSL,
        auth: {
          user: account.username,
          pass: account.password,
        },
        connectionTimeout: account.connectionTimeout || 30000,
      };

      // Handle STARTTLS
      if (account.securityType === SmtpSecurityType.STARTTLS) {
        transportConfig.requireTLS = true;
      }

      const transport = createTransport(transportConfig);

      // Verify connection
      await transport.verify();

      this.transportCache.set(cacheKey, transport);
      return transport;
    } catch (error) {
      logger.error("Error creating SMTP transport", {
        accountId: account.id,
        accountName: account.name,
        error: parseError(error).message,
      });

      // Update account health status
      await this.updateAccountHealth(
        account.id,
        false,
        logger,
        parseError(error).message,
      );

      return await Promise.reject(new Error(parseError(error).message));
    }
  }

  /**
   * Send email using database-configured SMTP account with retry and fallback support
   */
  async sendEmail(
    data: SmtpSendRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpSendResponseOutput>> {
    try {
      logger.debug("Sending email via SMTP service", {
        to: data.to,
        subject: data.subject,
      });

      // Get the primary account first
      const primaryAccount = await this.getSmtpAccountWithCriteria(
        data.selectionCriteria,
        logger,
      );
      if (!primaryAccount) {
        const isLeadCampaign =
          data.selectionCriteria.campaignType === CampaignType.LEAD_CAMPAIGN;

        if (isLeadCampaign) {
          return fail({
            message:
              "app.api.emails.smtpClient.sending.errors.no_account.title",
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
        } else {
          return fail({
            message:
              "app.api.emails.smtpClient.sending.errors.no_account.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              campaignType: data.selectionCriteria.campaignType,
            },
          });
        }
      }

      // Try primary account with retry logic
      const primaryResult = await this.attemptEmailSendWithRetry(
        data,
        primaryAccount,
        false,
        logger,
      );
      if (primaryResult.success) {
        return primaryResult;
      }

      // If primary failed after retries, try with fallback account
      logger.debug(
        "Primary SMTP account failed after retries, trying fallback",
        {
          to: data.to,
          primaryAccountId: primaryAccount.id,
          primaryError: primaryResult.message,
        },
      );

      const fallbackAccount = await this.getFallbackSmtpAccount(logger);
      if (!fallbackAccount || fallbackAccount.id === primaryAccount.id) {
        // No fallback available or fallback is same as primary
        return primaryResult;
      }

      const fallbackResult = await this.attemptEmailSendWithRetry(
        data,
        fallbackAccount,
        true,
        logger,
      );
      if (fallbackResult.success) {
        return fallbackResult;
      }

      // Both attempts failed
      logger.error("All SMTP accounts failed", {
        to: data.to,
        primaryAccountId: primaryAccount.id,
        fallbackAccountId: fallbackAccount.id,
        primaryError: primaryResult.message,
        fallbackError: fallbackResult.message,
      });

      return fallbackResult; // Return the last error
    } catch (error) {
      logger.error("Critical error in email sending", parseError(error));
      return fail({
        message: "app.api.emails.smtpClient.sending.errors.server.title",
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Attempt to send email with retry logic for connection issues
   */
  private async attemptEmailSendWithRetry(
    params: SmtpSendParams,
    account: SmtpAccount,
    isFallback: boolean,
    logger: EndpointLogger,
    maxRetries = 2,
  ): Promise<ResponseType<SmtpSendResult>> {
    let lastError: ResponseType<SmtpSendResult> | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Note: Would use logger here if passed to private method
        logger.info("Attempting email send", {
          to: params.to,
          accountId: account.id,
          accountName: account.name,
          attempt,
          maxRetries,
          isFallback,
        });

        const result = await this.performEmailSend(params, account, logger);

        if (result.success) {
          if (attempt > 1) {
            // Note: Would use logger here if passed to private method
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

        // Check if this is a retryable error
        const isRetryable = this.isRetryableError(result.message);
        if (!isRetryable || attempt === maxRetries) {
          // Note: Would use logger here if passed to private method
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

        // Wait before retry (exponential backoff)
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
        // Note: Would use logger here if passed to private method
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
          message: "app.api.emails.smtpClient.sending.errors.server.title",
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

        // Wait before retry
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
    }

    return (
      lastError ||
      fail({
        message: "app.api.emails.smtpClient.sending.errors.server.title",
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          accountId: account.id,
        },
      })
    );
  }

  /**
   * Check if an error is retryable (temporary connection issues)
   */
  private isRetryableError(errorMessage: string): boolean {
    const retryablePatterns =
      /greeting|timeout|connect|refused|unreachable|reset|temporary/i;
    return retryablePatterns.test(errorMessage);
  }

  /**
   * Perform the actual email sending with an account
   */
  private async performEmailSend(
    params: SmtpSendParams,
    account: SmtpAccount,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpSendResult>> {
    try {
      // Check rate limits (skip if this is part of a pre-validated batch)
      if (!params.skipRateLimitCheck) {
        const rateLimitCheck = await this.checkRateLimit(account, logger);
        if (!rateLimitCheck.success) {
          // Convert rate limit error to proper SMTP send error
          return fail({
            message: rateLimitCheck.message,
            errorType: rateLimitCheck.errorType,
            messageParams: rateLimitCheck.messageParams,
            cause: rateLimitCheck,
          });
        }

        // Log rate limit status for monitoring
        if (rateLimitCheck.data.remainingCapacity < 10) {
          // Note: Would use logger here if passed to private method
          logger.info("Rate limit approaching", {
            accountId: account.id,
            accountName: account.name,
            remainingCapacity: rateLimitCheck.data.remainingCapacity,
            currentUsage: rateLimitCheck.data.currentUsage,
            limit: account.rateLimitPerHour,
          });
        }
      }

      // Get transport
      const transport = await this.getTransport(account, logger);

      // Prepare email headers
      const headers: Record<string, string> = {};
      if (params.unsubscribeUrl) {
        headers["List-Unsubscribe"] = `<${params.unsubscribeUrl}>`;
        headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
      }

      // Send email
      const result = await transport.sendMail({
        from: `${params.senderName} <${account.fromEmail}>`,
        to: params.toName ? `${params.toName} <${params.to}>` : params.to,
        replyTo: params.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
        headers,
      });

      // Check for rejections
      if (result.rejected && result.rejected.length > 0) {
        const rejectedReason =
          typeof result.rejected[0] === "string"
            ? result.rejected[0]
            : "app.api.emails.smtpClient.sending.errors.rejected.defaultReason";

        await this.updateAccountHealth(
          account.id,
          false,
          logger,
          rejectedReason,
        );

        return fail({
          message: "app.api.emails.smtpClient.sending.errors.rejected.title",
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: {
            recipient: params.to,
            reason: rejectedReason,
          },
        });
      }

      // Check if no recipients were accepted
      if (!result.accepted || result.accepted.length === 0) {
        await this.updateAccountHealth(
          account.id,
          false,
          logger,
          "app.api.emails.smtpClient.sending.errors.no_recipients.defaultReason",
        );

        return fail({
          message:
            "app.api.emails.smtpClient.sending.errors.no_recipients.title",
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: {
            recipient: params.to,
          },
        });
      }

      // Record email in database for rate limiting and tracking
      // Skip storing campaign emails in emails table to avoid duplicate storage
      // Campaign emails are already stored in emailCampaigns table
      if (!params.campaignId) {
        await this.recordEmailInDatabase(
          {
            subject: params.subject,
            recipientEmail: params.to,
            recipientName: params.toName,
            senderEmail: account.fromEmail,
            senderName: params.senderName,
            smtpAccountId: account.id,
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

      // Update account usage statistics
      await this.updateAccountUsage(account.id, logger);
      await this.updateAccountHealth(account.id, true, logger);

      // Note: Would use logger here if passed to private method
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

      // Mark account as unhealthy on connection errors
      const errorMessage = parseError(error).message;
      const isConnectionError =
        /greeting|timeout|connect|refused|unreachable/i.test(errorMessage);
      if (isConnectionError) {
        await this.updateAccountHealth(account.id, false, logger, errorMessage);
      }

      return fail({
        message: "app.api.emails.smtpClient.sending.errors.server.title",
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          error: parseError(error).message,
          accountId: account.id,
          accountName: account.name,
        },
      });
    }
  }

  /**
   * Check rate limits for account with database validation
   * Returns remaining capacity for better queue management
   */
  private async checkRateLimit(
    account: SmtpAccount,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      canSend: boolean;
      remainingCapacity: number;
      currentUsage: number;
    }>
  > {
    try {
      // If no rate limit is set, allow unlimited sending
      if (!account.rateLimitPerHour) {
        return success({
          canSend: true,
          remainingCapacity: Number.MAX_SAFE_INTEGER,
          currentUsage: 0,
        });
      }

      // Check hourly rate limit only - simplified approach
      const currentHour = new Date();
      currentHour.setMinutes(0, 0, 0);

      // Count emails sent within the last hour for this specific account
      // Check both emails table (for non-campaign emails) and emailCampaigns table (for campaign emails)
      const [emailsCount, campaignsCount] = await Promise.all([
        db
          .select({ count: sql<number>`COUNT(*)::int` })
          .from(emails)
          .where(
            and(
              eq(emails.smtpAccountId, account.id),
              gte(emails.sentAt, currentHour),
              eq(emails.status, EmailStatus.SENT),
            ),
          ),
        db
          .select({ count: sql<number>`COUNT(*)::int` })
          .from(emailCampaigns)
          .where(
            and(
              eq(emailCampaigns.smtpAccountId, account.id),
              gte(emailCampaigns.sentAt, currentHour),
              eq(emailCampaigns.status, EmailStatus.SENT),
            ),
          ),
      ]);

      const emailsSentThisHour =
        (emailsCount[0]?.count || 0) + (campaignsCount[0]?.count || 0);

      const remainingCapacity = Math.max(
        0,
        account.rateLimitPerHour - emailsSentThisHour,
      );
      const canSend = remainingCapacity > 0;

      if (!canSend) {
        return fail({
          message: "app.api.emails.smtpClient.sending.errors.rate_limit.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            accountName: account.name,
            limit: account.rateLimitPerHour,
            current: emailsSentThisHour,
            timeWindow: "hour",
            remainingCapacity: 0,
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
      // On error, allow limited sending to be safe
      return success({
        canSend: true,
        remainingCapacity: 10, // Conservative fallback
        currentUsage: 0,
      });
    }
  }

  /**
   * Record email in database for tracking and rate limiting
   */
  private async recordEmailInDatabase(
    emailData: {
      subject: string;
      recipientEmail: string;
      recipientName?: string;
      senderEmail: string;
      senderName: string;
      smtpAccountId: string;
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
        smtpAccountId: emailData.smtpAccountId,
        externalId: emailData.messageId,
        type: this.getEmailTypeFromCampaign(emailData.campaignType),
        status: EmailStatus.SENT,
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
      // Don't throw error to avoid breaking email sending
    }
  }

  /**
   * Get email type from campaign type
   */
  private getEmailTypeFromCampaign(
    campaignType: (typeof CampaignType)[keyof typeof CampaignType] | null,
  ): (typeof EmailType)[keyof typeof EmailType] {
    switch (campaignType) {
      case CampaignType.LEAD_CAMPAIGN:
        return EmailType.LEAD_CAMPAIGN;
      case CampaignType.NEWSLETTER:
        return EmailType.MARKETING;
      case CampaignType.TRANSACTIONAL:
        return EmailType.TRANSACTIONAL;
      case CampaignType.NOTIFICATION:
        return EmailType.NOTIFICATION;
      case CampaignType.SYSTEM:
        return EmailType.SYSTEM;
      default:
        return EmailType.TRANSACTIONAL;
    }
  }

  /**
   * Update account usage statistics
   */
  private async updateAccountUsage(
    accountId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      await db
        .update(smtpAccounts)
        .set({
          emailsSentToday: sql`emails_sent_today + 1`,
          emailsSentThisMonth: sql`emails_sent_this_month + 1`,
          totalEmailsSent: sql`total_emails_sent + 1`,
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(smtpAccounts.id, accountId));
    } catch (error) {
      logger.error("Error updating account usage", parseError(error));
    }
  }

  /**
   * Update account health status
   */
  private async updateAccountHealth(
    accountId: string,
    success: boolean,
    logger: EndpointLogger,
    errorMessage?: string,
  ): Promise<void> {
    try {
      if (success) {
        await db
          .update(smtpAccounts)
          .set({
            healthCheckStatus: SmtpHealthStatus.HEALTHY,
            consecutiveFailures: 0,
            lastHealthCheck: new Date(),
            lastFailureAt: null,
            lastFailureReason: null,
            updatedAt: new Date(),
          })
          .where(eq(smtpAccounts.id, accountId));
      } else {
        await db
          .update(smtpAccounts)
          .set({
            healthCheckStatus: SmtpHealthStatus.UNHEALTHY,
            consecutiveFailures: sql`consecutive_failures + 1`,
            lastHealthCheck: new Date(),
            lastFailureAt: new Date(),
            lastFailureReason: errorMessage,
            updatedAt: new Date(),
          })
          .where(eq(smtpAccounts.id, accountId));
      }
    } catch (error) {
      logger.error("Error updating account health", parseError(error));
    }
  }

  /**
   * Get total sending capacity across all active SMTP accounts
   * Used for intelligent queue management
   */
  async getTotalSendingCapacity(
    data: SmtpCapacityRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpCapacityResponseOutput>> {
    try {
      const { t } = simpleT(locale);

      // Check user authorization
      if (user.isPublic) {
        return fail({
          message: t("app.api.emails.smtpClient.sending.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Get SMTP accounts - filter by accountId if provided
      const accounts = data.accountId
        ? await db
            .select()
            .from(smtpAccounts)
            .where(
              and(
                eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE),
                eq(smtpAccounts.id, data.accountId),
              ),
            )
        : await db
            .select()
            .from(smtpAccounts)
            .where(eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE));

      if (accounts.length === 0) {
        return success({
          totalCapacity: 0,
          remainingCapacity: 0,
        });
      }

      let totalCapacity = 0;
      let totalRemainingCapacity = 0;

      // Check rate limits for each account
      for (const account of accounts) {
        const accountCapacity = account.rateLimitPerHour || 0;
        totalCapacity += accountCapacity;

        const rateLimitCheck = await this.checkRateLimit(account, logger);
        if (rateLimitCheck.success) {
          // Account is available, add remaining capacity
          totalRemainingCapacity += rateLimitCheck.data.remainingCapacity;
        }
        // If rate limit check fails, account contributes 0 to remaining capacity
        // but still counts toward total capacity
      }

      return success({
        totalCapacity,
        remainingCapacity: totalRemainingCapacity,
      });
    } catch (error) {
      logger.error("Error getting total sending capacity", parseError(error));
      return fail({
        message: "app.api.emails.smtpClient.sending.errors.capacity.title",
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Close all cached transports
   */
  async closeAllTransports(logger: EndpointLogger): Promise<void> {
    for (const [accountId, transport] of this.transportCache.entries()) {
      try {
        await new Promise<void>((resolve) => {
          transport.close();
          resolve();
        });
      } catch (error) {
        logger.error(
          "Error closing transport",
          { accountId },
          parseError(error),
        );
      }
    }
    this.transportCache.clear();
  }
}

/**
 * Export singleton instance
 */
export const smtpSendingRepository = new SmtpSendingRepositoryImpl();
