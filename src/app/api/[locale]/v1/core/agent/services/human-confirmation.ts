/**
 * Enhanced Human Confirmation Service
 * Rich confirmation interfaces with detailed context, approval workflows,
 * and comprehensive execution tracking for human oversight
 */

import "server-only";

import { and, eq, inArray, lt } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { Email } from "../../emails/messages/db";
import { emails } from "../../emails/messages/db";
import {
  type AiToolCall,
  type EmailAgentProcessing,
  emailAgentProcessing,
  type HumanConfirmationRequest,
  humanConfirmationRequests,
  type NewHumanConfirmationRequest,
} from "../db";
import type {
  ConfirmationStatusValue,
  EmailAgentActionTypeValue,
  EmailAgentToolTypeValue,
} from "../enum";
import {
  ConfirmationStatus,
  EmailAgentActionType,
  EmailAgentToolType,
} from "../enum";
import type { ToolExecutionService } from "./tool-execution";
import { toolExecutionService } from "./tool-execution";

/**
 * Confirmation Request Context
 */
export interface ConfirmationRequestContext {
  email: Email;
  processing: EmailAgentProcessing;
  toolCall: AiToolCall;
  reasoning: string;
  confidence: number;
  expiresAt: Date;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Rich Confirmation Details
 */
export interface RichConfirmationDetails {
  id: string;
  emailContext: {
    id: string;
    subject: string;
    from: string;
    to: string;
    receivedAt: Date;
    snippet: string;
    priority: string;
  };
  actionDetails: {
    type: typeof EmailAgentActionTypeValue;
    toolType: typeof EmailAgentToolTypeValue;
    parameters: Record<string, string>;
    reasoning: string;
    confidence: number;
    estimatedImpact: "low" | "medium" | "high";
    reversible: boolean;
  };
  aiAnalysis: {
    systemPromptUsed: string;
    reasoning: string;
    confidence: number;
    alternativeActions: Array<{
      type: typeof EmailAgentActionTypeValue;
      reasoning: string;
      confidence: number;
    }>;
  };
  riskAssessment: {
    level: "low" | "medium" | "high" | "critical";
    factors: string[];
    mitigations: string[];
    requiresEscalation: boolean;
  };
  timeline: {
    requestedAt: Date;
    expiresAt: Date;
    timeRemaining: number;
    urgency: "low" | "normal" | "high" | "urgent";
  };
  status: typeof ConfirmationStatusValue;
  executionPreview?: {
    expectedOutcome: string;
    potentialSideEffects: string[];
    rollbackPlan?: string;
  };
}

/**
 * Confirmation Response
 */
export interface ConfirmationResponse {
  confirmationId: string;
  action: "approve" | "reject" | "modify";
  reason?: string;
  modifications?: Record<string, string>;
  escalate?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Batch Confirmation Request
 */
export interface BatchConfirmationRequest {
  confirmationIds: string[];
  action: "approve" | "reject";
  reason?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Confirmation Analytics
 */
export interface ConfirmationAnalytics {
  totalRequests: number;
  pendingRequests: number;
  approvalRate: number;
  averageResponseTime: number;
  topActionTypes: Array<{
    type: typeof EmailAgentActionTypeValue;
    count: number;
    approvalRate: number;
  }>;
  riskDistribution: Record<string, number>;
  expirationRate: number;
  escalationRate: number;
}

/**
 * Human Confirmation Service Interface
 */
export interface HumanConfirmationService {
  createConfirmationRequest(
    context: ConfirmationRequestContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<HumanConfirmationRequest>>;

  getConfirmationDetails(
    confirmationId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails>>;

  respondToConfirmation(
    confirmationId: string,
    response: ConfirmationResponse,
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      executed: boolean;
      result?: Record<string, string | number | boolean>;
    }>
  >;

  batchRespondToConfirmations(
    request: BatchConfirmationRequest,
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      processed: number;
      results: Array<{ id: string; success: boolean; error?: string }>;
    }>
  >;

  getPendingConfirmations(
    filters:
      | {
          actionTypes?: (typeof EmailAgentActionTypeValue)[];
          riskLevels?: string[];
          urgency?: string[];
          limit?: number;
        }
      | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails[]>>;

  getConfirmationHistory(
    emailId: string | undefined,
    limit: number | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails[]>>;

  getConfirmationAnalytics(
    timeRange:
      | {
          start: Date;
          end: Date;
        }
      | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConfirmationAnalytics>>;

  expireOldConfirmations(
    logger: EndpointLogger,
  ): Promise<ResponseType<{ expired: number }>>;
}

/**
 * Enhanced Human Confirmation Service Implementation
 */
class HumanConfirmationServiceImpl implements HumanConfirmationService {
  private readonly toolExecutionService: ToolExecutionService;

  constructor(toolExecutionService: ToolExecutionService) {
    this.toolExecutionService = toolExecutionService;
  }

  /**
   * Create a new confirmation request
   */
  async createConfirmationRequest(
    context: ConfirmationRequestContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<HumanConfirmationRequest>> {
    try {
      logger.info("human.confirmation.create.start", {
        emailId: context.email.id,
        actionType: context.toolCall.toolType,
      });

      return await withTransaction(logger, async (tx) => {
        const newRequest: NewHumanConfirmationRequest = {
          emailId: context.email.id,
          processingId: context.processing.id,
          actionType: this.mapToolTypeToActionType(context.toolCall.toolType),
          toolCall: context.toolCall,
          reasoning: context.reasoning,
          expiresAt: context.expiresAt,
          status: ConfirmationStatus.PENDING,
          metadata: context.metadata
            ? JSON.parse(JSON.stringify(context.metadata))
            : {},
        };

        const [created] = await tx
          .insert(humanConfirmationRequests)
          .values(newRequest)
          .returning();

        logger.info("human.confirmation.create.success", {
          confirmationId: created.id,
          emailId: context.email.id,
          expiresAt: context.expiresAt,
        });

        return createSuccessResponse(created);
      });
    } catch (error) {
      logger.error("human.confirmation.create.error", error, {
        emailId: context.email.id,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get rich confirmation details
   */
  async getConfirmationDetails(
    confirmationId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails>> {
    try {
      logger.info("human.confirmation.details.start", { confirmationId });

      const result = await db
        .select({
          confirmation: humanConfirmationRequests,
          email: emails,
          processing: emailAgentProcessing,
        })
        .from(humanConfirmationRequests)
        .innerJoin(emails, eq(humanConfirmationRequests.emailId, emails.id))
        .innerJoin(
          emailAgentProcessing,
          eq(humanConfirmationRequests.processingId, emailAgentProcessing.id),
        )
        .where(eq(humanConfirmationRequests.id, confirmationId))
        .limit(1);

      if (result.length === 0) {
        return createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const { confirmation, email, processing } = result[0];
      const richDetails = await this.buildRichConfirmationDetails(
        confirmation,
        email,
        processing,
        logger,
      );

      return createSuccessResponse(richDetails);
    } catch (error) {
      logger.error("human.confirmation.details.error", error, {
        confirmationId,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Respond to a confirmation request
   */
  async respondToConfirmation(
    confirmationId: string,
    response: ConfirmationResponse,
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      executed: boolean;
      result?: Record<string, string | number | boolean>;
    }>
  > {
    try {
      logger.info("human.confirmation.respond.start", {
        confirmationId,
        action: response.action,
        userId,
      });

      return await withTransaction(logger, async (tx) => {
        // Get confirmation request
        const confirmationResult = await this.getConfirmationDetails(
          confirmationId,
          logger,
        );
        if (!confirmationResult.success) {
          return confirmationResult as ResponseType<{
            executed: boolean;
            result?: Record<string, unknown>;
          }>;
        }

        const confirmation = confirmationResult.data;

        // Validate confirmation is still pending
        if (confirmation.status !== ConfirmationStatus.PENDING) {
          return createErrorResponse(
            "email.errors.sending_failed",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Check if expired
        if (new Date() > confirmation.timeline.expiresAt) {
          return createErrorResponse(
            "email.errors.sending_failed",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        let executed = false;
        let executionResult:
          | Record<string, string | number | boolean>
          | undefined;

        // Update confirmation status
        const newStatus =
          response.action === "approve"
            ? ConfirmationStatus.APPROVED
            : ConfirmationStatus.REJECTED;

        await tx
          .update(humanConfirmationRequests)
          .set({
            status: newStatus,
            respondedAt: new Date(),
            respondedBy: userId,
            response: response.reason,
            updatedAt: new Date(),
          })
          .where(eq(humanConfirmationRequests.id, confirmationId));

        // Execute action if approved
        if (response.action === "approve") {
          const executionContext = {
            emailId: confirmation.emailContext.id,
            toolType: confirmation.actionDetails.toolType,
            parameters:
              response.modifications || confirmation.actionDetails.parameters,
            reasoning: confirmation.actionDetails.reasoning,
            confidence: confirmation.actionDetails.confidence,
            userId,
          };

          const toolResult = await this.toolExecutionService.executeTool(
            executionContext,
            logger,
          );

          if (toolResult.success) {
            executed = true;
            // Convert unknown values to string for database storage
            const rawResult = toolResult.data.result || {};
            executionResult = Object.fromEntries(
              Object.entries(rawResult).map(([key, value]) => [
                key,
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
                  ? value
                  : String(value),
              ]),
            );

            // Update confirmation with execution result
            await tx
              .update(humanConfirmationRequests)
              .set({
                executedAt: new Date(),
                executionResult: Object.fromEntries(
                  Object.entries(executionResult).map(([key, value]) => [
                    key,
                    String(value),
                  ]),
                ),
                updatedAt: new Date(),
              })
              .where(eq(humanConfirmationRequests.id, confirmationId));
          } else {
            // Update with execution error
            await tx
              .update(humanConfirmationRequests)
              .set({
                executionError: toolResult.message || "Execution failed",
                updatedAt: new Date(),
              })
              .where(eq(humanConfirmationRequests.id, confirmationId));
          }
        }

        logger.info("human.confirmation.respond.success", {
          confirmationId,
          action: response.action,
          executed,
          userId,
        });

        return createSuccessResponse({ executed, result: executionResult });
      });
    } catch (error) {
      logger.error("human.confirmation.respond.error", error, {
        confirmationId,
        response,
        userId,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Batch respond to multiple confirmations
   */
  async batchRespondToConfirmations(
    request: BatchConfirmationRequest,
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      processed: number;
      results: Array<{ id: string; success: boolean; error?: string }>;
    }>
  > {
    try {
      logger.info("human.confirmation.batch.start", {
        count: request.confirmationIds.length,
        action: request.action,
        userId,
      });

      const results: Array<{ id: string; success: boolean; error?: string }> =
        [];
      let processed = 0;

      for (const confirmationId of request.confirmationIds) {
        try {
          const response: ConfirmationResponse = {
            confirmationId,
            action: request.action,
            reason: request.reason,
            metadata: request.metadata,
          };

          const result = await this.respondToConfirmation(
            confirmationId,
            response,
            userId,
            logger,
          );

          if (result.success) {
            results.push({ id: confirmationId, success: true });
            processed++;
          } else {
            results.push({
              id: confirmationId,
              success: false,
              error: result.message || "Unknown error",
            });
          }
        } catch (error) {
          results.push({
            id: confirmationId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      logger.info("human.confirmation.batch.success", {
        processed,
        total: request.confirmationIds.length,
        userId,
      });

      return createSuccessResponse({ processed, results });
    } catch (error) {
      logger.error("human.confirmation.batch.error", error, {
        request,
        userId,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get pending confirmations with filters
   */
  async getPendingConfirmations(
    filters:
      | {
          actionTypes?: (typeof EmailAgentActionTypeValue)[];
          riskLevels?: string[];
          urgency?: string[];
          limit?: number;
        }
      | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails[]>> {
    try {
      logger.info("human.confirmation.pending.start", { filters });

      const conditions = [
        eq(humanConfirmationRequests.status, ConfirmationStatus.PENDING),
      ];

      if (filters?.actionTypes && filters.actionTypes.length > 0) {
        conditions.push(
          inArray(humanConfirmationRequests.actionType, filters.actionTypes),
        );
      }

      const result = await db
        .select({
          confirmation: humanConfirmationRequests,
          email: emails,
          processing: emailAgentProcessing,
        })
        .from(humanConfirmationRequests)
        .innerJoin(emails, eq(humanConfirmationRequests.emailId, emails.id))
        .innerJoin(
          emailAgentProcessing,
          eq(humanConfirmationRequests.processingId, emailAgentProcessing.id),
        )
        .where(and(...conditions))
        .limit(filters?.limit || 50)
        .orderBy(humanConfirmationRequests.requestedAt);

      const richDetails = await Promise.all(
        result.map(({ confirmation, email, processing }) =>
          this.buildRichConfirmationDetails(
            confirmation,
            email,
            processing,
            logger,
          ),
        ),
      );

      // Apply additional filters that require rich details
      let filteredDetails = richDetails;

      if (filters?.riskLevels && filters.riskLevels.length > 0) {
        filteredDetails = filteredDetails.filter((detail) =>
          filters.riskLevels!.includes(detail.riskAssessment.level),
        );
      }

      if (filters?.urgency && filters.urgency.length > 0) {
        filteredDetails = filteredDetails.filter((detail) =>
          filters.urgency!.includes(detail.timeline.urgency),
        );
      }

      return createSuccessResponse(filteredDetails);
    } catch (error) {
      logger.error("human.confirmation.pending.error", error, { filters });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get confirmation history
   */
  async getConfirmationHistory(
    emailId: string | undefined,
    limit: number | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<RichConfirmationDetails[]>> {
    try {
      logger.info("human.confirmation.history.start", { emailId, limit });

      const conditions = [];
      if (emailId) {
        conditions.push(eq(humanConfirmationRequests.emailId, emailId));
      }

      const result = await db
        .select({
          confirmation: humanConfirmationRequests,
          email: emails,
          processing: emailAgentProcessing,
        })
        .from(humanConfirmationRequests)
        .innerJoin(emails, eq(humanConfirmationRequests.emailId, emails.id))
        .innerJoin(
          emailAgentProcessing,
          eq(humanConfirmationRequests.processingId, emailAgentProcessing.id),
        )
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit || 100)
        .orderBy(humanConfirmationRequests.requestedAt);

      const richDetails = await Promise.all(
        result.map(({ confirmation, email, processing }) =>
          this.buildRichConfirmationDetails(
            confirmation,
            email,
            processing,
            logger,
          ),
        ),
      );

      return createSuccessResponse(richDetails);
    } catch (error) {
      logger.error("human.confirmation.history.error", error, {
        emailId,
        limit,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get confirmation analytics
   */
  async getConfirmationAnalytics(
    timeRange:
      | {
          start: Date;
          end: Date;
        }
      | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConfirmationAnalytics>> {
    try {
      logger.info("human.confirmation.analytics.start", { timeRange });

      // TODO: Implement comprehensive analytics queries
      // For now, provide basic analytics structure
      const analytics: ConfirmationAnalytics = {
        totalRequests: 0,
        pendingRequests: 0,
        approvalRate: 0,
        averageResponseTime: 0,
        topActionTypes: [],
        riskDistribution: {},
        expirationRate: 0,
        escalationRate: 0,
      };

      return createSuccessResponse(analytics);
    } catch (error) {
      logger.error("human.confirmation.analytics.error", error, { timeRange });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Expire old confirmations
   */
  async expireOldConfirmations(
    logger: EndpointLogger,
  ): Promise<ResponseType<{ expired: number }>> {
    try {
      logger.info("human.confirmation.expire.start");

      const now = new Date();
      const expiredConfirmations = await db
        .update(humanConfirmationRequests)
        .set({
          status: ConfirmationStatus.EXPIRED,
          updatedAt: now,
        })
        .where(
          and(
            eq(humanConfirmationRequests.status, ConfirmationStatus.PENDING),
            lt(humanConfirmationRequests.expiresAt, now),
          ),
        )
        .returning({ id: humanConfirmationRequests.id });

      const expired = expiredConfirmations.length;

      logger.info("human.confirmation.expire.success", { expired });

      return createSuccessResponse({ expired });
    } catch (error) {
      logger.error("human.confirmation.expire.error", error);

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Map tool type to action type
   */
  private mapToolTypeToActionType(
    toolType: typeof EmailAgentToolTypeValue,
  ): typeof EmailAgentActionTypeValue {
    switch (toolType) {
      case EmailAgentToolType.EMAIL_RESPONSE:
        return EmailAgentActionType.RESPOND_TO_EMAIL;
      case EmailAgentToolType.EMAIL_DELETE:
        return EmailAgentActionType.DELETE_EMAIL;
      case EmailAgentToolType.KNOWLEDGE_BASE_SEARCH:
        return EmailAgentActionType.SEARCH_KNOWLEDGE_BASE;
      case EmailAgentToolType.WEB_SEARCH:
        return EmailAgentActionType.WEB_SEARCH;
      default:
        return EmailAgentActionType.ESCALATE_TO_HUMAN;
    }
  }

  /**
   * Build rich confirmation details
   */
  private async buildRichConfirmationDetails(
    confirmation: HumanConfirmationRequest,
    email: Email,
    processing: EmailAgentProcessing,
    logger: EndpointLogger,
  ): Promise<RichConfirmationDetails> {
    const now = new Date();
    const timeRemaining = Math.max(
      0,
      confirmation.expiresAt.getTime() - now.getTime(),
    );

    // Check if toolCall exists
    if (!confirmation.toolCall) {
      throw new Error("Tool call is missing from confirmation request");
    }

    // Assess risk level based on action type and confidence
    const riskLevel = this.assessRiskLevel(
      confirmation.actionType,
      confirmation.toolCall,
    );

    // Determine urgency based on time remaining and risk level
    const urgency = this.determineUrgency(timeRemaining, riskLevel);

    // Generate execution preview
    const executionPreview = this.generateExecutionPreview(
      confirmation.toolCall,
    );

    return {
      id: confirmation.id,
      emailContext: {
        id: email.id,
        subject: email.subject,
        from: email.senderEmail,
        to: email.recipientEmail,
        receivedAt: email.createdAt,
        snippet: this.generateEmailSnippet(email),
        priority: processing.priority,
      },
      actionDetails: {
        type: confirmation.actionType,
        toolType: confirmation.toolCall.toolType,
        parameters: confirmation.toolCall.parameters,
        reasoning: confirmation.reasoning,
        confidence: confirmation.toolCall.confidence,
        estimatedImpact: this.estimateImpact(confirmation.toolCall),
        reversible: this.isReversible(confirmation.toolCall.toolType),
      },
      aiAnalysis: {
        systemPromptUsed: processing.aiProcessingResult?.systemPromptUsed || "",
        reasoning: processing.aiProcessingResult?.reasoning || "",
        confidence: processing.aiProcessingResult?.confidence || 0,
        alternativeActions:
          processing.aiProcessingResult?.recommendedActions?.slice(1) || [],
      },
      riskAssessment: {
        level: riskLevel,
        factors: this.getRiskFactors(confirmation.toolCall, email),
        mitigations: this.getMitigations(confirmation.toolCall),
        requiresEscalation: riskLevel === "critical",
      },
      timeline: {
        requestedAt: confirmation.requestedAt,
        expiresAt: confirmation.expiresAt,
        timeRemaining,
        urgency,
      },
      status: confirmation.status,
      executionPreview,
    };
  }

  /**
   * Assess risk level
   */
  private assessRiskLevel(
    actionType: typeof EmailAgentActionTypeValue,
    toolCall: AiToolCall,
  ): RichConfirmationDetails["riskAssessment"]["level"] {
    // High-risk actions
    if (actionType === EmailAgentActionType.DELETE_EMAIL) {
      return "high";
    }

    // Medium-risk actions
    if (actionType === EmailAgentActionType.RESPOND_TO_EMAIL) {
      return toolCall.confidence < 0.8 ? "medium" : "low";
    }

    // Low-risk actions
    return "low";
  }

  /**
   * Determine urgency
   */
  private determineUrgency(
    timeRemaining: number,
    riskLevel: string,
  ): RichConfirmationDetails["timeline"]["urgency"] {
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);

    if (riskLevel === "critical" || hoursRemaining < 1) {
      return "urgent";
    } else if (riskLevel === "high" || hoursRemaining < 4) {
      return "high";
    } else if (hoursRemaining < 12) {
      return "normal";
    } else {
      return "low";
    }
  }

  /**
   * Generate email snippet
   */
  private generateEmailSnippet(email: Email): string {
    const content = email.bodyText || email.bodyHtml || "";
    return content.length > 200 ? `${content.substring(0, 200)}...` : content;
  }

  /**
   * Estimate impact
   */
  private estimateImpact(
    toolCall: AiToolCall,
  ): RichConfirmationDetails["actionDetails"]["estimatedImpact"] {
    switch (toolCall.toolType) {
      case EmailAgentToolType.EMAIL_DELETE:
        return "high";
      case EmailAgentToolType.EMAIL_RESPONSE:
        return "medium";
      default:
        return "low";
    }
  }

  /**
   * Check if action is reversible
   */
  private isReversible(toolType: typeof EmailAgentToolTypeValue): boolean {
    switch (toolType) {
      case EmailAgentToolType.EMAIL_DELETE:
        return false; // Email deletion is typically irreversible
      case EmailAgentToolType.EMAIL_RESPONSE:
        return false; // Email sending is irreversible
      default:
        return true;
    }
  }

  /**
   * Get risk factors
   */
  private getRiskFactors(toolCall: AiToolCall, email: Email): string[] {
    const factors: string[] = [];

    if (toolCall.confidence < 0.7) {
      factors.push("Low AI confidence");
    }

    if (toolCall.toolType === EmailAgentToolType.EMAIL_DELETE) {
      factors.push("Irreversible action");
    }

    if (
      email.subject.toLowerCase().includes("urgent") ||
      email.subject.toLowerCase().includes("important")
    ) {
      factors.push("High-priority email");
    }

    return factors;
  }

  /**
   * Get mitigations
   */
  private getMitigations(toolCall: AiToolCall): string[] {
    const mitigations: string[] = [];

    if (toolCall.toolType === EmailAgentToolType.EMAIL_RESPONSE) {
      mitigations.push("Review generated response before sending");
      mitigations.push("Verify recipient information");
    }

    if (toolCall.toolType === EmailAgentToolType.EMAIL_DELETE) {
      mitigations.push("Confirm email is not important");
      mitigations.push("Check for backup requirements");
    }

    return mitigations;
  }

  /**
   * Generate execution preview
   */
  private generateExecutionPreview(
    toolCall: AiToolCall,
  ): RichConfirmationDetails["executionPreview"] {
    switch (toolCall.toolType) {
      case EmailAgentToolType.EMAIL_RESPONSE:
        return {
          expectedOutcome: "Email response will be sent to the sender",
          potentialSideEffects: [
            "May create follow-up conversation",
            "Could set expectations",
          ],
          rollbackPlan: "No rollback possible once sent",
        };
      case EmailAgentToolType.EMAIL_DELETE:
        return {
          expectedOutcome: "Email will be permanently deleted",
          potentialSideEffects: ["Loss of information", "Cannot be recovered"],
          rollbackPlan: "No rollback possible",
        };
      default:
        return {
          expectedOutcome: "Action will be executed as specified",
          potentialSideEffects: ["Minimal impact expected"],
        };
    }
  }
}

/**
 * Human Confirmation Service Instance
 */
export const humanConfirmationService = new HumanConfirmationServiceImpl(
  toolExecutionService,
);
