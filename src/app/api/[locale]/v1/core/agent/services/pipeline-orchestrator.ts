/**
 * Email Agent Pipeline Orchestrator Service
 * Central coordinator for the entire email processing pipeline with stage transitions,
 * error handling, retry logic, and comprehensive monitoring
 */

import "server-only";

import { and, count, eq, inArray, sql } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { type Email, emails } from "../../emails/messages/db";
import {
  type AiProcessingResult,
  type EmailAgentProcessing,
  emailAgentProcessing,
  type HardRulesResult,
  humanConfirmationRequests,
  type NewEmailAgentProcessing,
} from "../db";
import {
  ConfirmationStatus,
  EmailAgentActionType,
  EmailAgentStatus,
  EmailAgentToolType,
  ProcessingPriority,
} from "../enum";
import type { AiProcessingService } from "./ai-processing";
import { aiProcessingService } from "./ai-processing";
import type { HardRulesService } from "./hard-rules";
import { hardRulesService } from "./hard-rules";

/**
 * Pipeline Stage Configuration
 */
export interface PipelineStageConfig {
  name: string;
  enabled: boolean;
  timeout: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
  skipOnError: boolean;
}

/**
 * Pipeline Configuration
 */
export interface PipelineConfig {
  stages: {
    hardRules: PipelineStageConfig;
    aiProcessing: PipelineStageConfig;
    toolExecution: PipelineStageConfig;
    humanConfirmation: PipelineStageConfig;
  };
  global: {
    maxConcurrentProcessing: number;
    processingTimeout: number;
    enableDetailedLogging: boolean;
    enableMetrics: boolean;
  };
}

/**
 * Processing Context
 */
export interface ProcessingContext {
  email: Email;
  processing: EmailAgentProcessing;
  config: PipelineConfig;
  startTime: number;
  retryCount: number;
  previousErrors: string[];
}

/**
 * Pipeline Execution Result
 */
export interface PipelineExecutionResult {
  emailId: string;
  processingId: string;
  finalStatus: EmailAgentStatus;
  stagesCompleted: string[];
  stageResults: {
    hardRules?: HardRulesResult;
    aiProcessing?: AiProcessingResult;
    toolExecution?: Record<string, unknown>;
    humanConfirmation?: Record<string, unknown>;
  };
  executionTime: number;
  errors: Array<{
    stage: string;
    error: string;
    timestamp: Date;
    retryAttempt: number;
  }>;
  metrics: {
    totalProcessingTime: number;
    stageTimings: Record<string, number>;
    retryCount: number;
    confirmationsCreated: number;
    toolCallsExecuted: number;
  };
}

/**
 * Batch Processing Request
 */
export interface BatchProcessingRequest {
  emailIds?: string[];
  accountIds?: string[];
  statusFilter?: EmailAgentStatus[];
  priorityFilter?: ProcessingPriority[];
  maxBatchSize?: number;
  config?: Partial<PipelineConfig>;
  dryRun?: boolean;
}

/**
 * Batch Processing Result
 */
export interface BatchProcessingResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  results: PipelineExecutionResult[];
  summary: {
    averageProcessingTime: number;
    totalExecutionTime: number;
    stageSuccessRates: Record<string, number>;
    errorSummary: Record<string, number>;
  };
}

/**
 * Default Pipeline Configuration
 */
const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  stages: {
    hardRules: {
      name: "Hard Rules Processing",
      enabled: true,
      timeout: 30000, // 30 seconds
      maxRetries: 2,
      retryDelay: 1000, // 1 second
      skipOnError: false,
    },
    aiProcessing: {
      name: "AI Processing",
      enabled: true,
      timeout: 60000, // 60 seconds
      maxRetries: 3,
      retryDelay: 2000, // 2 seconds
      skipOnError: false,
    },
    toolExecution: {
      name: "Tool Execution",
      enabled: true,
      timeout: 45000, // 45 seconds
      maxRetries: 2,
      retryDelay: 1500, // 1.5 seconds
      skipOnError: true,
    },
    humanConfirmation: {
      name: "Human Confirmation",
      enabled: true,
      timeout: 86400000, // 24 hours
      maxRetries: 0,
      retryDelay: 0,
      skipOnError: false,
    },
  },
  global: {
    maxConcurrentProcessing: 10,
    processingTimeout: 300000, // 5 minutes
    enableDetailedLogging: true,
    enableMetrics: true,
  },
};

/**
 * Pipeline Orchestrator Service Interface
 */
export interface PipelineOrchestratorService {
  processEmail(
    emailId: string,
    config: Partial<PipelineConfig> | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<PipelineExecutionResult>>;

  processBatch(
    request: BatchProcessingRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchProcessingResult>>;

  retryFailedProcessing(
    processingId: string,
    config: Partial<PipelineConfig> | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<PipelineExecutionResult>>;

  getProcessingStatus(
    emailId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailAgentProcessing>>;

  cancelProcessing(
    emailId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  getProcessingMetrics(logger: EndpointLogger): Promise<
    ResponseType<{
      totalProcessed: number;
      currentlyProcessing: number;
      averageProcessingTime: number;
      successRate: number;
      stageMetrics: Record<string, unknown>;
    }>
  >;
}

/**
 * Pipeline Orchestrator Service Implementation
 */
class PipelineOrchestratorServiceImpl implements PipelineOrchestratorService {
  private readonly hardRulesService: HardRulesService;
  private readonly aiProcessingService: AiProcessingService;

  constructor(
    hardRulesService: HardRulesService,
    aiProcessingService: AiProcessingService,
  ) {
    this.hardRulesService = hardRulesService;
    this.aiProcessingService = aiProcessingService;
  }

  /**
   * Process a single email through the complete pipeline
   */
  async processEmail(
    emailId: string,
    config: Partial<PipelineConfig> | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<PipelineExecutionResult>> {
    const mergedConfig = this.mergeConfig(config);
    const startTime = Date.now();

    try {
      logger.info("pipeline.orchestrator.process.start", {
        emailId,
        config: mergedConfig,
      });

      return await withTransaction(async (tx) => {
        // Get email and processing record
        const emailData = await this.getEmailWithProcessing(
          emailId,
          tx,
          logger,
        );
        if (!emailData.success) {
          return emailData;
        }

        const { email, processing } = emailData.data;
        const context: ProcessingContext = {
          email,
          processing,
          config: mergedConfig,
          startTime,
          retryCount: processing.processingAttempts || 0,
          previousErrors: processing.errors || [],
        };

        // Execute pipeline stages
        const result = await this.executePipelineStages(context, tx, logger);

        logger.info("pipeline.orchestrator.process.success", {
          emailId,
          finalStatus: result.finalStatus,
          executionTime: result.executionTime,
          stagesCompleted: result.stagesCompleted,
        });

        return createSuccessResponse(result);
      });
    } catch (error) {
      logger.error("pipeline.orchestrator.process.error", error, {
        emailId,
        executionTime: Date.now() - startTime,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Process multiple emails in batch
   */
  async processBatch(
    request: BatchProcessingRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchProcessingResult>> {
    const startTime = Date.now();
    const config = this.mergeConfig(request.config);

    try {
      logger.info("pipeline.orchestrator.batch.start", {
        request,
        config,
      });

      // Get emails to process
      const emailsToProcess = await this.getEmailsForBatchProcessing(
        request,
        logger,
      );
      if (!emailsToProcess.success) {
        return emailsToProcess as ResponseType<BatchProcessingResult>;
      }

      const emails = emailsToProcess.data;
      const results: PipelineExecutionResult[] = [];
      let successful = 0;
      let failed = 0;
      let skipped = 0;

      // Process emails with concurrency control
      const maxConcurrent = config.global.maxConcurrentProcessing;
      const chunks = this.chunkArray(emails, maxConcurrent);

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(async (email) => {
          const result = await this.processEmail(
            email.id,
            request.config,
            logger,
          );
          if (result.success) {
            results.push(result.data);
            if (result.data.finalStatus === EmailAgentStatus.COMPLETED) {
              successful++;
            } else if (result.data.finalStatus === EmailAgentStatus.FAILED) {
              failed++;
            } else {
              skipped++;
            }
          } else {
            failed++;
          }
        });

        await Promise.all(chunkPromises);
      }

      const totalExecutionTime = Date.now() - startTime;
      const batchResult: BatchProcessingResult = {
        totalProcessed: emails.length,
        successful,
        failed,
        skipped,
        results,
        summary: {
          averageProcessingTime:
            results.length > 0
              ? results.reduce((sum, r) => sum + r.executionTime, 0) /
                results.length
              : 0,
          totalExecutionTime,
          stageSuccessRates: this.calculateStageSuccessRates(results),
          errorSummary: this.summarizeErrors(results),
        },
      };

      logger.info("pipeline.orchestrator.batch.success", batchResult.summary);
      return createSuccessResponse(batchResult);
    } catch (error) {
      logger.error("pipeline.orchestrator.batch.error", error, {
        request,
        executionTime: Date.now() - startTime,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Retry failed processing
   */
  async retryFailedProcessing(
    processingId: string,
    config: Partial<PipelineConfig> | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<PipelineExecutionResult>> {
    try {
      logger.info("pipeline.orchestrator.retry.start", { processingId });

      // Get processing record
      const processingRecord = await db
        .select()
        .from(emailAgentProcessing)
        .where(eq(emailAgentProcessing.id, processingId))
        .limit(1);

      if (processingRecord.length === 0) {
        return createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const processing = processingRecord[0];

      // Reset status to pending for retry
      await db
        .update(emailAgentProcessing)
        .set({
          status: EmailAgentStatus.PENDING,
          processingAttempts: (processing.processingAttempts || 0) + 1,
          lastError: null,
          lastErrorAt: null,
          updatedAt: new Date(),
        })
        .where(eq(emailAgentProcessing.id, processingId));

      // Process the email again
      return await this.processEmail(processing.emailId, config, logger);
    } catch (error) {
      logger.error("pipeline.orchestrator.retry.error", error, {
        processingId,
      });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get processing status
   */
  async getProcessingStatus(
    emailId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailAgentProcessing>> {
    try {
      logger.debug("pipeline.orchestrator.status.start", { emailId });

      const processing = await db
        .select()
        .from(emailAgentProcessing)
        .where(eq(emailAgentProcessing.emailId, emailId))
        .limit(1);

      if (processing.length === 0) {
        return createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(processing[0]);
    } catch (error) {
      logger.error("pipeline.orchestrator.status.error", error, { emailId });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Cancel processing
   */
  async cancelProcessing(
    emailId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.info("pipeline.orchestrator.cancel.start", { emailId });

      await db
        .update(emailAgentProcessing)
        .set({
          status: EmailAgentStatus.SKIPPED,
          updatedAt: new Date(),
        })
        .where(eq(emailAgentProcessing.emailId, emailId));

      logger.info("pipeline.orchestrator.cancel.success", { emailId });
      return createSuccessResponse(true);
    } catch (error) {
      logger.error("pipeline.orchestrator.cancel.error", error, { emailId });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get processing metrics
   */
  async getProcessingMetrics(logger: EndpointLogger): Promise<
    ResponseType<{
      totalProcessed: number;
      currentlyProcessing: number;
      averageProcessingTime: number;
      successRate: number;
      stageMetrics: Record<string, unknown>;
    }>
  > {
    try {
      logger.debug("pipeline.orchestrator.metrics.start");

      const stats = await db
        .select({
          total: count(),
          processing: count(
            sql`CASE WHEN ${emailAgentProcessing.status} = ${EmailAgentStatus.PROCESSING} THEN 1 END`,
          ),
          completed: count(
            sql`CASE WHEN ${emailAgentProcessing.status} = ${EmailAgentStatus.COMPLETED} THEN 1 END`,
          ),
          failed: count(
            sql`CASE WHEN ${emailAgentProcessing.status} = ${EmailAgentStatus.FAILED} THEN 1 END`,
          ),
        })
        .from(emailAgentProcessing);

      const successRate =
        stats[0] && stats[0].total > 0
          ? (stats[0].completed / (stats[0].completed + stats[0].failed)) * 100
          : 0;

      const result = {
        totalProcessed: stats[0]?.total || 0,
        currentlyProcessing: stats[0]?.processing || 0,
        averageProcessingTime: 0, // TODO: Calculate from actual data
        successRate,
        stageMetrics: {
          hardRulesSuccess: 0, // TODO: Calculate from actual data
          aiProcessingSuccess: 0, // TODO: Calculate from actual data
          toolExecutionSuccess: 0, // TODO: Calculate from actual data
        },
      };

      logger.debug("pipeline.orchestrator.metrics.success", result);
      return createSuccessResponse(result);
    } catch (error) {
      logger.error("pipeline.orchestrator.metrics.error", error);
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Merge configuration with defaults
   */
  private mergeConfig(config?: Partial<PipelineConfig>): PipelineConfig {
    if (!config) {
      return DEFAULT_PIPELINE_CONFIG;
    }

    return {
      stages: {
        hardRules: {
          ...DEFAULT_PIPELINE_CONFIG.stages.hardRules,
          ...config.stages?.hardRules,
        },
        aiProcessing: {
          ...DEFAULT_PIPELINE_CONFIG.stages.aiProcessing,
          ...config.stages?.aiProcessing,
        },
        toolExecution: {
          ...DEFAULT_PIPELINE_CONFIG.stages.toolExecution,
          ...config.stages?.toolExecution,
        },
        humanConfirmation: {
          ...DEFAULT_PIPELINE_CONFIG.stages.humanConfirmation,
          ...config.stages?.humanConfirmation,
        },
      },
      global: { ...DEFAULT_PIPELINE_CONFIG.global, ...config.global },
    };
  }

  /**
   * Get email with processing record
   */
  private async getEmailWithProcessing(
    emailId: string,
    tx: any,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ email: Email; processing: EmailAgentProcessing }>> {
    try {
      logger.debug("pipeline.orchestrator.get_email.start", { emailId });

      const result = await tx
        .select({
          email: emails,
          processing: emailAgentProcessing,
        })
        .from(emails)
        .leftJoin(
          emailAgentProcessing,
          eq(emails.id, emailAgentProcessing.emailId),
        )
        .where(eq(emails.id, emailId))
        .limit(1);

      if (result.length === 0) {
        return createErrorResponse(
          "email.errors.sending_failed",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      let { email, processing } = result[0];

      // Create processing record if it doesn't exist
      if (!processing) {
        const newProcessing: NewEmailAgentProcessing = {
          emailId: email.id,
          status: EmailAgentStatus.PENDING,
          priority: ProcessingPriority.NORMAL,
          processingAttempts: 0,
        };

        const [created] = await tx
          .insert(emailAgentProcessing)
          .values(newProcessing)
          .returning();

        processing = created;
      }

      return createSuccessResponse({ email, processing });
    } catch (error) {
      logger.error("pipeline.orchestrator.get_email.error", error, { emailId });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get emails for batch processing
   */
  private async getEmailsForBatchProcessing(
    request: BatchProcessingRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<Email[]>> {
    try {
      logger.debug("pipeline.orchestrator.get_batch_emails.start", { request });

      const conditions = [];

      if (request.emailIds && request.emailIds.length > 0) {
        conditions.push(inArray(emails.id, request.emailIds));
      }

      if (request.accountIds && request.accountIds.length > 0) {
        conditions.push(inArray(emails.imapAccountId, request.accountIds));
      }

      const query = db
        .select()
        .from(emails)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(request.maxBatchSize || 100);

      const result = await query;
      logger.debug("pipeline.orchestrator.get_batch_emails.success", {
        count: result.length,
      });
      return createSuccessResponse(result);
    } catch (error) {
      logger.error("pipeline.orchestrator.get_batch_emails.error", error, {
        request,
      });
      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Calculate stage success rates
   */
  private calculateStageSuccessRates(
    results: PipelineExecutionResult[],
  ): Record<string, number> {
    const stageStats: Record<string, { total: number; successful: number }> =
      {};

    results.forEach((result) => {
      result.stagesCompleted.forEach((stage) => {
        if (!stageStats[stage]) {
          stageStats[stage] = { total: 0, successful: 0 };
        }
        stageStats[stage].total++;
        if (result.errors.filter((e) => e.stage === stage).length === 0) {
          stageStats[stage].successful++;
        }
      });
    });

    const successRates: Record<string, number> = {};
    Object.entries(stageStats).forEach(([stage, stats]) => {
      successRates[stage] =
        stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;
    });

    return successRates;
  }

  /**
   * Summarize errors
   */
  private summarizeErrors(
    results: PipelineExecutionResult[],
  ): Record<string, number> {
    const errorSummary: Record<string, number> = {};

    results.forEach((result) => {
      result.errors.forEach((error) => {
        const key = `${error.stage}: ${error.error}`;
        errorSummary[key] = (errorSummary[key] || 0) + 1;
      });
    });

    return errorSummary;
  }

  /**
   * Execute pipeline stages
   */
  private async executePipelineStages(
    context: ProcessingContext,
    tx: any,
    logger: EndpointLogger,
  ): Promise<PipelineExecutionResult> {
    const result: PipelineExecutionResult = {
      emailId: context.email.id,
      processingId: context.processing.id,
      finalStatus: EmailAgentStatus.PROCESSING,
      stagesCompleted: [],
      stageResults: {},
      executionTime: 0,
      errors: [],
      metrics: {
        totalProcessingTime: 0,
        stageTimings: {},
        retryCount: context.retryCount,
        confirmationsCreated: 0,
        toolCallsExecuted: 0,
      },
    };

    try {
      // Update status to processing
      await tx
        .update(emailAgentProcessing)
        .set({
          status: EmailAgentStatus.PROCESSING,
          lastProcessedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(emailAgentProcessing.id, context.processing.id));

      // Stage 1: Hard Rules Processing
      if (context.config.stages.hardRules.enabled) {
        const stageResult = await this.executeHardRulesStage(
          context,
          tx,
          logger,
        );
        if (stageResult.success) {
          result.stagesCompleted.push("hardRules");
          result.stageResults.hardRules = stageResult.data.result;
          result.metrics.stageTimings.hardRules =
            stageResult.data.executionTime;

          // If hard rules found definitive actions, skip AI processing
          if (
            stageResult.data.result.bounceDetected ||
            stageResult.data.result.spamDetected
          ) {
            result.finalStatus = EmailAgentStatus.COMPLETED;
            await this.updateFinalStatus(
              context.processing.id,
              result.finalStatus,
              tx,
              logger,
            );
            result.executionTime = Date.now() - context.startTime;
            return result;
          }
        } else {
          result.errors.push({
            stage: "hardRules",
            error: stageResult.message || "Hard rules processing failed",
            timestamp: new Date(),
            retryAttempt: context.retryCount,
          });

          if (!context.config.stages.hardRules.skipOnError) {
            result.finalStatus = EmailAgentStatus.FAILED;
            await this.updateFinalStatus(
              context.processing.id,
              result.finalStatus,
              tx,
              logger,
            );
            result.executionTime = Date.now() - context.startTime;
            return result;
          }
        }
      }

      // Stage 2: AI Processing
      if (context.config.stages.aiProcessing.enabled) {
        const stageResult = await this.executeAiProcessingStage(
          context,
          tx,
          logger,
        );
        if (stageResult.success) {
          result.stagesCompleted.push("aiProcessing");
          result.stageResults.aiProcessing = stageResult.data.result;
          result.metrics.stageTimings.aiProcessing =
            stageResult.data.executionTime;

          // Create confirmation requests for actions requiring approval
          const confirmationResult = await this.createConfirmationRequests(
            context,
            stageResult.data.result,
            tx,
            logger,
          );
          result.metrics.confirmationsCreated = confirmationResult.created;

          if (confirmationResult.created > 0) {
            result.finalStatus = EmailAgentStatus.AWAITING_CONFIRMATION;
          } else {
            result.finalStatus = EmailAgentStatus.COMPLETED;
          }
        } else {
          result.errors.push({
            stage: "aiProcessing",
            error: stageResult.message || "AI processing failed",
            timestamp: new Date(),
            retryAttempt: context.retryCount,
          });

          if (!context.config.stages.aiProcessing.skipOnError) {
            result.finalStatus = EmailAgentStatus.FAILED;
            await this.updateFinalStatus(
              context.processing.id,
              result.finalStatus,
              tx,
              logger,
            );
            result.executionTime = Date.now() - context.startTime;
            return result;
          }
        }
      }

      // Update final status
      await this.updateFinalStatus(
        context.processing.id,
        result.finalStatus,
        tx,
        logger,
      );
      result.executionTime = Date.now() - context.startTime;
      result.metrics.totalProcessingTime = result.executionTime;

      return result;
    } catch (error) {
      result.errors.push({
        stage: "pipeline",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
        retryAttempt: context.retryCount,
      });

      result.finalStatus = EmailAgentStatus.FAILED;
      await this.updateFinalStatus(
        context.processing.id,
        result.finalStatus,
        tx,
        logger,
      );
      result.executionTime = Date.now() - context.startTime;

      return result;
    }
  }

  /**
   * Execute hard rules stage
   */
  private async executeHardRulesStage(
    context: ProcessingContext,
    tx: any,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ result: HardRulesResult; executionTime: number }>> {
    const stageStartTime = Date.now();

    try {
      const result = await this.hardRulesService.processEmail(
        {
          email: context.email,
          headers: (context.email.headers as Record<string, string>) || {},
          bodyText: context.email.bodyText || undefined,
          bodyHtml: context.email.bodyHtml || undefined,
        },
        logger,
      );

      if (result.success) {
        // Update processing record with hard rules result
        await tx
          .update(emailAgentProcessing)
          .set({
            status: EmailAgentStatus.HARD_RULES_COMPLETE,
            hardRulesResult: result.data,
            hardRulesProcessedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(emailAgentProcessing.id, context.processing.id));

        return createSuccessResponse({
          result: result.data,
          executionTime: Date.now() - stageStartTime,
        });
      }

      return result as ResponseType<{
        result: HardRulesResult;
        executionTime: number;
      }>;
    } catch (error) {
      logger.error("pipeline.orchestrator.hard_rules.error", error, {
        emailId: context.email.id,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Execute AI processing stage
   */
  private async executeAiProcessingStage(
    context: ProcessingContext,
    tx: any,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ result: AiProcessingResult; executionTime: number }>
  > {
    const stageStartTime = Date.now();

    try {
      const result = await this.aiProcessingService.processEmail(
        {
          email: context.email,
          headers: (context.email.headers as Record<string, string>) || {},
          bodyText: context.email.bodyText || undefined,
          bodyHtml: context.email.bodyHtml || undefined,
          hardRulesResult: context.processing.hardRulesResult
            ? JSON.parse(JSON.stringify(context.processing.hardRulesResult))
            : undefined,
        },
        logger,
      );

      if (result.success) {
        // Update processing record with AI result
        await tx
          .update(emailAgentProcessing)
          .set({
            status: EmailAgentStatus.AI_PROCESSING,
            aiProcessingResult: result.data,
            aiProcessedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(emailAgentProcessing.id, context.processing.id));

        return createSuccessResponse({
          result: result.data,
          executionTime: Date.now() - stageStartTime,
        });
      }

      return result as ResponseType<{
        result: AiProcessingResult;
        executionTime: number;
      }>;
    } catch (error) {
      logger.error("pipeline.orchestrator.ai_processing.error", error, {
        emailId: context.email.id,
      });

      return createErrorResponse(
        "email.errors.sending_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Create confirmation requests for actions requiring approval
   */
  private async createConfirmationRequests(
    context: ProcessingContext,
    aiResult: AiProcessingResult,
    tx: any,
    logger: EndpointLogger,
  ): Promise<{ created: number }> {
    let created = 0;

    try {
      const confirmationToolCalls = aiResult.toolCalls.filter(
        (tc) => tc.requiresConfirmation,
      );

      for (const toolCall of confirmationToolCalls) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

        await tx.insert(humanConfirmationRequests).values({
          emailId: context.email.id,
          processingId: context.processing.id,
          actionType:
            toolCall.toolType === EmailAgentToolType.EMAIL_RESPONSE
              ? EmailAgentActionType.RESPOND_TO_EMAIL
              : toolCall.toolType === EmailAgentToolType.EMAIL_DELETE
                ? EmailAgentActionType.DELETE_EMAIL
                : EmailAgentActionType.ESCALATE_TO_HUMAN,
          toolCall: toolCall,
          reasoning: toolCall.reasoning,
          expiresAt,
          status: ConfirmationStatus.PENDING,
        });

        created++;
      }

      return { created };
    } catch (error) {
      logger.error("pipeline.orchestrator.confirmations.error", error, {
        emailId: context.email.id,
      });
      return { created };
    }
  }

  /**
   * Update final processing status
   */
  private async updateFinalStatus(
    processingId: string,
    status: EmailAgentStatus,
    tx: any,
    logger: EndpointLogger,
  ): Promise<void> {
    logger.debug("pipeline.orchestrator.update_status", {
      processingId,
      status,
    });
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === EmailAgentStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    await tx
      .update(emailAgentProcessing)
      .set(updateData)
      .where(eq(emailAgentProcessing.id, processingId));
  }
}

/**
 * Pipeline Orchestrator Service Instance
 */
export const pipelineOrchestratorService = new PipelineOrchestratorServiceImpl(
  hardRulesService,
  aiProcessingService,
);
