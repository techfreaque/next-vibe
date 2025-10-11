/**
 * Hard Rules Processing Service
 * Stage 1 processing for bounce detection, spam classification, and delivery failure handling
 */

/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { Email } from "../../emails/messages/db";
import type { HardRulesResult as DbHardRulesResult } from "../db";
import { BounceCategory, BounceCategoryValue, EmailAgentActionType } from "../enum";

// Constants for string literals to avoid i18next/no-literal-string errors
const BOUNCE_PATTERNS = {
  EMPTY_RETURN_PATH: "<>",
  DELIVERY_FAILURE: "delivery failure",
  RETURNED_MAIL: "returned mail",
  USER_UNKNOWN: "user unknown",
  INVALID_RECIPIENT: "invalid recipient",
  ADDRESS_NOT_FOUND: "address not found",
  NO_SUCH_USER: "no such user",
  RECIPIENT_REJECTED: "recipient address rejected",
  MAILBOX_UNAVAILABLE: "mailbox unavailable",
  DELIVERY_FAILED: "delivery failed",
} as const;

const SPAM_PATTERNS = {
  SUBJECT: [
    "free money",
    "click here now",
    "limited time offer",
    "act now",
    "congratulations you have won",
    "urgent response required",
    "verify your account",
    "suspended account",
  ],
  SENDER: ["noreply@suspicious", "admin@", "security@", "support@"],
  CONTENT: [
    "click here to unsubscribe",
    "remove me from this list",
    "this is not spam",
    "you have been selected",
    "claim your prize",
    "enter your password",
    "verify your identity",
  ],
} as const;

const AUTO_REPLY_PATTERNS = [
  "out of office",
  "automatic reply",
  "vacation message",
  "away message",
  "auto-response",
] as const;

const DELIVERY_FAILURE_PATTERNS = [
  { pattern: "connection timed out", category: "network_error" },
  { pattern: "dns lookup failed", category: "dns_error" },
  { pattern: "server unavailable", category: "server_error" },
  { pattern: "quota exceeded", category: "quota_error" },
  { pattern: "message too large", category: "size_error" },
  { pattern: "authentication failed", category: "auth_error" },
  { pattern: "relay access denied", category: "relay_error" },
] as const;

const STATUS_CODES = {
  PERMANENT_FAILURE_PREFIX: "5.",
  TEMPORARY_FAILURE_PREFIX: "4.",
} as const;

const CONTENT_PATTERNS = {
  PERMANENT_FAILURE: "permanent failure",
  MAILBOX_FULL: "mailbox full",
  QUOTA_EXCEEDED: "quota exceeded",
  OPT_OUT: "opt out",
  USER_UNKNOWN: "user unknown",
  INVALID_RECIPIENT: "invalid recipient",
} as const;

const MESSAGES = {
  BOUNCE_DETECTED: "Bounce detected",
  FAILED_RECIPIENT: "failed recipient:",
  DSN_PREFIX: "DSN:",
  STATUS_PREFIX: "status:",
  BOUNCE_PATTERN_DETECTED: "Bounce pattern detected:",
  HIGH_SPAM_SCORE: "High spam score detected:",
  SPAM_PATTERN_SUBJECT: "Spam pattern in subject:",
  SUSPICIOUS_SENDER: "Suspicious sender pattern:",
  SPAM_CONTENT_PATTERN: "Spam content pattern:",
  DELIVERY_FAILURE_DETECTED: "Delivery failure detected:",
  AUTO_REPLY_DETECTED: "Auto-reply detected:",
  AUTO_REPLY_CATEGORY: "auto_reply",
} as const;

/**
 * Hard Rules Result Interface - aligned with database schema
 */
export interface HardRulesResult extends DbHardRulesResult {
  // This interface extends the database schema without additional properties
}

/**
 * Email Processing Context
 */
export interface EmailProcessingContext {
  email: Email;
  headers: Record<string, string>;
  bodyText?: string;
  bodyHtml?: string;
}

/**
 * Advanced Email Header Analysis Interface
 */
interface EmailHeaders {
  returnPath?: string;
  deliveryStatus?: string;
  xFailedRecipients?: string;
  xOriginalTo?: string;
  autoSubmitted?: string;
  precedence?: string;
  listUnsubscribe?: string;
  messageId?: string;
  inReplyTo?: string;
  references?: string;
  contentType?: string;
  xSpamScore?: string;
  xSpamFlag?: string;
  received?: string[];
}

/**
 * Recipient Extraction Result
 */
interface RecipientInfo {
  originalRecipient?: string;
  failedRecipient?: string;
  bounceReason?: string;
  deliveryStatus?: string;
  diagnosticCode?: string;
}

/**
 * Delivery Status Notification (DSN) Parser
 */
interface DSNInfo {
  action: "failed" | "delayed" | "delivered" | "relayed" | "expanded";
  status: string; // e.g., "5.1.1", "4.2.2"
  recipient: string;
  diagnosticCode?: string;
  remoteMta?: string;
  finalRecipient?: string;
}

/**
 * Hard Rules Service Interface
 */
export interface HardRulesService {
  processEmail(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<HardRulesResult>>;
  detectBounce(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isBounce: boolean;
      category?: typeof BounceCategoryValue;
      reason?: string;
      confidence: number;
    }>
  >;
  detectSpam(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isSpam: boolean;
      reason?: string;
      confidence: number;
    }>
  >;
  classifyDeliveryFailure(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isFailure: boolean;
      reason?: string;
      category?: string;
      confidence: number;
    }>
  >;
}

/**
 * Hard Rules Service Implementation
 */
class HardRulesServiceImpl implements HardRulesService {
  /**
   * Process email through hard rules
   */
  async processEmail(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<HardRulesResult>> {
    try {
      logger.info("hard.rules.process.start", {
        emailId: context.email.id,
      });

      const actions: HardRulesResult["actions"] = [];
      let bounceDetected = false;
      let bounceCategory: typeof BounceCategoryValue | undefined;
      let spamDetected = false;
      let deliveryFailureReason: string | undefined;

      // Stage 1: Bounce Detection
      const bounceResult = await this.detectBounce(context, logger);
      if (bounceResult.success && bounceResult.data.isBounce) {
        bounceDetected = true;
        bounceCategory = bounceResult.data.category;

        const BOUNCE_REASON = "email_detected_as_bounce";
        const DETECTION_METHOD = "hard_rules";

        actions.push({
          type: "MARK_BOUNCED",
          reason: bounceResult.data.reason || BOUNCE_REASON,
          confidence: bounceResult.data.confidence,
          metadata: {
            category: bounceCategory || "",
            detectionMethod: DETECTION_METHOD,
          },
        });
      }

      // Stage 2: Spam Detection (only if not bounced)
      if (!bounceDetected) {
        const spamResult = await this.detectSpam(context, logger);
        if (spamResult.success && spamResult.data.isSpam) {
          spamDetected = true;

          const SPAM_REASON = "email_detected_as_spam";
          const DETECTION_METHOD = "hard_rules";

          actions.push({
            type: "MARK_SPAM",
            reason: spamResult.data.reason || SPAM_REASON,
            confidence: spamResult.data.confidence,
            metadata: {
              detectionMethod: DETECTION_METHOD,
            },
          });
        }
      }

      // Stage 3: Delivery Failure Classification (only if not bounced or spam)
      if (!bounceDetected && !spamDetected) {
        const failureResult = await this.classifyDeliveryFailure(
          context,
          logger,
        );
        if (failureResult.success && failureResult.data.isFailure) {
          deliveryFailureReason = failureResult.data.reason;

          const FAILURE_REASON = "email_delivery_failure_detected";
          const DETECTION_METHOD = "hard_rules";

          actions.push({
            type: "CLASSIFY_DELIVERY_FAILURE",
            reason: failureResult.data.reason || FAILURE_REASON,
            confidence: failureResult.data.confidence,
            metadata: {
              category: failureResult.data.category || "",
              detectionMethod: DETECTION_METHOD,
            },
          });
        }
      }

      const result: HardRulesResult = {
        processed: true,
        actions,
        bounceDetected,
        bounceCategory,
        spamDetected,
        deliveryFailureReason,
      };

      logger.info("hard.rules.process.success", {
        emailId: context.email.id,
        actionsCount: actions.length,
        bounceDetected,
        spamDetected,
      });

      return createSuccessResponse(result);
    } catch (error) {
      logger.error("hard.rules.process.error", error, {
        emailId: context.email.id,
      });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Extract recipient information from undelivered mail
   */
  private extractRecipientInfo(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): RecipientInfo {
    const { headers, bodyText } = context;
    const recipientInfo: RecipientInfo = {};

    // Extract from X-Failed-Recipients header
    const failedRecipients = headers["x-failed-recipients"];
    if (failedRecipients) {
      recipientInfo.failedRecipient = failedRecipients.trim();
    }

    // Extract from X-Original-To header
    const originalTo = headers["x-original-to"];
    if (originalTo) {
      recipientInfo.originalRecipient = originalTo.trim();
    }

    // Extract from Delivery-Status header
    const deliveryStatus = headers["delivery-status"];
    if (deliveryStatus) {
      recipientInfo.deliveryStatus = deliveryStatus.trim();
    }

    // Parse DSN from body text
    if (bodyText) {
      const dsnInfo = this.parseDSNFromBody(bodyText, logger);
      if (dsnInfo) {
        recipientInfo.originalRecipient =
          recipientInfo.originalRecipient || dsnInfo.recipient;
        recipientInfo.bounceReason = dsnInfo.diagnosticCode;
        recipientInfo.deliveryStatus = dsnInfo.status;
      }
    }

    return recipientInfo;
  }

  /**
   * Parse Delivery Status Notification from email body
   */
  private parseDSNFromBody(
    bodyText: string,
    logger: EndpointLogger,
  ): DSNInfo | null {
    try {
      // Look for DSN format patterns
      const lines = bodyText.split("\n");
      let dsnInfo: Partial<DSNInfo> = {};

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Parse Action field
        const ACTION_PREFIX = "Action:";
        const STATUS_PREFIX = "Status:";
        const VALID_ACTIONS = [
          "failed",
          "delayed",
          "delivered",
          "relayed",
          "expanded",
        ];

        if (trimmedLine.startsWith(ACTION_PREFIX)) {
          const action = trimmedLine.substring(7).trim().toLowerCase();
          if (VALID_ACTIONS.includes(action)) {
            dsnInfo.action = action as DSNInfo["action"];
          }
        }

        // Parse Status field
        else if (trimmedLine.startsWith(STATUS_PREFIX)) {
          dsnInfo.status = trimmedLine.substring(7).trim();
        }

        // Parse Final-Recipient field
        else if (trimmedLine.startsWith("Final-Recipient:")) {
          const recipient = trimmedLine.substring(16).trim();
          // Remove RFC822; prefix if present
          dsnInfo.recipient = recipient.replace(/^rfc822;/i, "").trim();
        }

        // Parse Diagnostic-Code field
        else if (trimmedLine.startsWith("Diagnostic-Code:")) {
          dsnInfo.diagnosticCode = trimmedLine.substring(16).trim();
        }

        // Parse Remote-MTA field
        else if (trimmedLine.startsWith("Remote-MTA:")) {
          dsnInfo.remoteMta = trimmedLine.substring(11).trim();
        }
      }

      // Validate required fields
      if (dsnInfo.action && dsnInfo.status && dsnInfo.recipient) {
        return dsnInfo as DSNInfo;
      }

      return null;
    } catch (error) {
      logger.debug("hard.rules.dsn.parse.error", { error });
      return null;
    }
  }

  /**
   * Parse email headers into structured format
   */
  private parseEmailHeaders(headers: Record<string, string>): EmailHeaders {
    return {
      returnPath: headers["return-path"],
      deliveryStatus: headers["delivery-status"],
      xFailedRecipients: headers["x-failed-recipients"],
      xOriginalTo: headers["x-original-to"],
      autoSubmitted: headers["auto-submitted"],
      precedence: headers["precedence"],
      listUnsubscribe: headers["list-unsubscribe"],
      messageId: headers["message-id"],
      inReplyTo: headers["in-reply-to"],
      references: headers["references"],
      contentType: headers["content-type"],
      xSpamScore: headers["x-spam-score"],
      xSpamFlag: headers["x-spam-flag"],
      received: headers["received"] ? [headers["received"]] : undefined,
    };
  }

  /**
   * Detect bounce emails with advanced recipient extraction
   */
  detectBounce(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isBounce: boolean;
      category?: typeof BounceCategoryValue;
      reason?: string;
      confidence: number;
    }>
  > {
    try {
      logger.debug("hard.rules.bounce.detect.start", {
        emailId: context.email.id,
      });

      const { headers, bodyText, bodyHtml } = context;
      let isBounce = false;
      let category: typeof BounceCategoryValue | undefined;
      let reason: string | undefined;
      let confidence = 0;

      // Extract recipient information for advanced analysis
      const recipientInfo = this.extractRecipientInfo(context, logger);
      this.parseEmailHeaders(headers);

      // Check for bounce indicators in headers
      const returnPath = headers["return-path"]?.toLowerCase() || "";
      const subject =
        headers["subject"]?.toLowerCase() ||
        context.email.subject.toLowerCase();
      const from =
        headers["from"]?.toLowerCase() ||
        context.email.senderEmail.toLowerCase();

      // Enhanced bounce detection with recipient info
      const hasFailedRecipient = !!recipientInfo.failedRecipient;
      const hasDeliveryStatus = !!recipientInfo.deliveryStatus;
      const hasDSNInfo = !!recipientInfo.bounceReason;

      // Enhanced bounce detection with multiple indicators
      if (
        returnPath.includes(BOUNCE_PATTERNS.EMPTY_RETURN_PATH) ||
        from.includes("mailer-daemon") ||
        from.includes("postmaster") ||
        subject.includes("undelivered") ||
        subject.includes(BOUNCE_PATTERNS.DELIVERY_FAILURE) ||
        subject.includes(BOUNCE_PATTERNS.RETURNED_MAIL) ||
        hasFailedRecipient ||
        hasDeliveryStatus ||
        hasDSNInfo
      ) {
        isBounce = true;
        confidence = hasFailedRecipient || hasDSNInfo ? 0.95 : 0.9;

        // Build detailed reason with recipient info
        const reasons: string[] = [MESSAGES.BOUNCE_DETECTED];
        if (hasFailedRecipient) {
          reasons.push(
            `${MESSAGES.FAILED_RECIPIENT} ${recipientInfo.failedRecipient}`,
          );
        }
        if (hasDSNInfo) {
          reasons.push(`${MESSAGES.DSN_PREFIX} ${recipientInfo.bounceReason}`);
        }
        if (hasDeliveryStatus) {
          reasons.push(
            `${MESSAGES.STATUS_PREFIX} ${recipientInfo.deliveryStatus}`,
          );
        }

        reason = reasons.join(", ");

        // Determine bounce category using DSN status codes and content analysis
        category = this.categorizeBounce(
          recipientInfo,
          subject,
          bodyText,
          logger,
        );

        // Increase confidence if we have structured DSN data
        if (recipientInfo.deliveryStatus) {
          confidence = Math.min(confidence + 0.05, 1.0);
        }
      }

      // Check body content for bounce patterns
      if (!isBounce && (bodyText || bodyHtml)) {
        const content = (bodyText || bodyHtml || "").toLowerCase();

        const bouncePatterns = [
          BOUNCE_PATTERNS.USER_UNKNOWN,
          BOUNCE_PATTERNS.INVALID_RECIPIENT,
          BOUNCE_PATTERNS.ADDRESS_NOT_FOUND,
          BOUNCE_PATTERNS.NO_SUCH_USER,
          BOUNCE_PATTERNS.RECIPIENT_REJECTED,
          BOUNCE_PATTERNS.MAILBOX_UNAVAILABLE,
          BOUNCE_PATTERNS.DELIVERY_FAILED,
        ];

        for (const pattern of bouncePatterns) {
          if (content.includes(pattern)) {
            isBounce = true;
            confidence = 0.8;
            reason = `${MESSAGES.BOUNCE_PATTERN_DETECTED} ${pattern}`;
            category = BounceCategory.INVALID_ADDRESS;
            break;
          }
        }
      }

      return Promise.resolve(
        createSuccessResponse({
          isBounce,
          category,
          reason,
          confidence,
        }),
      );
    } catch (error) {
      logger.error("hard.rules.bounce.detect.error", error, {
        emailId: context.email.id,
      });
      return Promise.resolve(
        createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
        ),
      );
    }
  }

  /**
   * Detect spam emails
   */
  detectSpam(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isSpam: boolean;
      reason?: string;
      confidence: number;
    }>
  > {
    try {
      logger.debug("hard.rules.spam.detect.start", {
        emailId: context.email.id,
      });

      const { headers, bodyText, bodyHtml } = context;
      let isSpam = false;
      let reason: string | undefined;
      let confidence = 0;

      const subject =
        headers["subject"]?.toLowerCase() ||
        context.email.subject.toLowerCase();
      const from =
        headers["from"]?.toLowerCase() ||
        context.email.senderEmail.toLowerCase();
      const content = (bodyText || bodyHtml || "").toLowerCase();

      // Check for spam indicators in headers
      const spamScore = headers["x-spam-score"] || headers["x-spam-level"];
      if (spamScore && parseFloat(spamScore) > 5) {
        isSpam = true;
        confidence = 0.9;
        reason = `High spam score detected: ${spamScore}`;
      }

      // Check for spam patterns in subject
      if (!isSpam) {
        const spamSubjectPatterns = [
          "free money",
          "click here now",
          "limited time offer",
          "act now",
          "congratulations you have won",
          "urgent response required",
          "verify your account",
          "suspended account",
        ];

        for (const pattern of spamSubjectPatterns) {
          if (subject.includes(pattern)) {
            isSpam = true;
            confidence = 0.7;
            reason = `Spam pattern in subject: ${pattern}`;
            break;
          }
        }
      }

      // Check for suspicious sender patterns
      if (!isSpam) {
        const suspiciousSenderPatterns = [
          "noreply@suspicious",
          "admin@",
          "security@",
          "support@",
        ];

        for (const pattern of suspiciousSenderPatterns) {
          if (
            from.includes(pattern) &&
            !from.includes(context.email.recipientEmail.split("@")[1])
          ) {
            isSpam = true;
            confidence = 0.6;
            reason = `Suspicious sender pattern: ${pattern}`;
            break;
          }
        }
      }

      // Check for spam content patterns
      if (!isSpam && content) {
        const spamContentPatterns = [
          "click here to unsubscribe",
          "remove me from this list",
          "this is not spam",
          "you have been selected",
          "claim your prize",
          "enter your password",
          "verify your identity",
        ];

        for (const pattern of spamContentPatterns) {
          if (content.includes(pattern)) {
            isSpam = true;
            confidence = 0.6;
            reason = `Spam content pattern: ${pattern}`;
            break;
          }
        }
      }

      return Promise.resolve(
        createSuccessResponse({
          isSpam,
          reason,
          confidence,
        }),
      );
    } catch (error) {
      logger.error("hard.rules.spam.detect.error", error, {
        emailId: context.email.id,
      });
      return Promise.resolve(
        createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
        ),
      );
    }
  }

  /**
   * Classify delivery failures
   */
  classifyDeliveryFailure(
    context: EmailProcessingContext,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      isFailure: boolean;
      reason?: string;
      category?: string;
      confidence: number;
    }>
  > {
    try {
      logger.debug("hard.rules.delivery.failure.start", {
        emailId: context.email.id,
      });

      const { headers, bodyText, bodyHtml } = context;
      let isFailure = false;
      let reason: string | undefined;
      let category: string | undefined;
      let confidence = 0;

      const subject =
        headers["subject"]?.toLowerCase() ||
        context.email.subject.toLowerCase();
      const content = (bodyText || bodyHtml || "").toLowerCase();

      // Check for delivery failure indicators
      const failurePatterns = [
        {
          pattern: "connection timed out",
          category: "network_error",
          confidence: 0.8,
        },
        {
          pattern: "dns lookup failed",
          category: "dns_error",
          confidence: 0.9,
        },
        {
          pattern: "server unavailable",
          category: "server_error",
          confidence: 0.8,
        },
        { pattern: "quota exceeded", category: "quota_error", confidence: 0.9 },
        {
          pattern: "message too large",
          category: "size_error",
          confidence: 0.9,
        },
        {
          pattern: "authentication failed",
          category: "auth_error",
          confidence: 0.8,
        },
        {
          pattern: "relay access denied",
          category: "relay_error",
          confidence: 0.8,
        },
      ];

      for (const {
        pattern,
        category: cat,
        confidence: conf,
      } of failurePatterns) {
        if (subject.includes(pattern) || content.includes(pattern)) {
          isFailure = true;
          reason = `Delivery failure detected: ${pattern}`;
          category = cat;
          confidence = conf;
          break;
        }
      }

      // Check for auto-reply indicators (not failures, but should be classified)
      if (!isFailure) {
        const autoReplyPatterns = [
          "out of office",
          "automatic reply",
          "vacation message",
          "away message",
          "auto-response",
        ];

        for (const pattern of autoReplyPatterns) {
          if (subject.includes(pattern) || content.includes(pattern)) {
            isFailure = true;
            reason = `Auto-reply detected: ${pattern}`;
            category = "auto_reply";
            confidence = 0.7;
            break;
          }
        }
      }

      return Promise.resolve(
        createSuccessResponse({
          isFailure,
          reason,
          category,
          confidence,
        }),
      );
    } catch (error) {
      logger.error("hard.rules.delivery.failure.error", error, {
        emailId: context.email.id,
      });
      return Promise.resolve(
        createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
        ),
      );
    }
  }

  /**
   * Categorize bounce based on DSN status codes and content analysis
   */
  private categorizeBounce(
    recipientInfo: RecipientInfo,
    subject: string,
    bodyText: string | undefined,
    logger: EndpointLogger,
  ): typeof BounceCategoryValue {
    // Use DSN status codes for precise categorization
    if (recipientInfo.deliveryStatus) {
      const status = recipientInfo.deliveryStatus;

      // 5.x.x = Permanent failure (Hard bounce)
      if (status.startsWith("5.")) {
        if (status.startsWith("5.1.")) {
          return BounceCategory.INVALID_ADDRESS;
        }
        if (status.startsWith("5.2.")) {
          return BounceCategory.MAILBOX_FULL;
        }
        if (status.startsWith("5.7.")) {
          return BounceCategory.SPAM_COMPLAINT;
        }
        return BounceCategory.HARD_BOUNCE;
      }

      // 4.x.x = Temporary failure (Soft bounce)
      if (status.startsWith("4.")) {
        if (status.startsWith("4.2.")) {
          return BounceCategory.MAILBOX_FULL;
        }
        return BounceCategory.SOFT_BOUNCE;
      }
    }

    // Fallback to content-based categorization
    const content = `${subject} ${bodyText || ""}`.toLowerCase();

    if (
      content.includes("permanent") ||
      content.includes("permanent failure")
    ) {
      return BounceCategory.HARD_BOUNCE;
    }

    if (
      content.includes("mailbox full") ||
      content.includes("quota exceeded")
    ) {
      return BounceCategory.MAILBOX_FULL;
    }

    if (content.includes("spam") || content.includes("blocked")) {
      return BounceCategory.SPAM_COMPLAINT;
    }

    if (content.includes("unsubscribe") || content.includes("opt out")) {
      return BounceCategory.UNSUBSCRIBE;
    }

    if (
      content.includes("user unknown") ||
      content.includes("invalid recipient")
    ) {
      return BounceCategory.INVALID_ADDRESS;
    }

    // Default to soft bounce if we can't determine the specific type
    return BounceCategory.SOFT_BOUNCE;
  }
}

/**
 * Hard Rules Service Instance
 */
export const hardRulesService = new HardRulesServiceImpl();
