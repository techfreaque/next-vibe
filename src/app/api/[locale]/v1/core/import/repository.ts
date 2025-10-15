/**
 * Generic Import Repository
 * Handles CSV import operations for any domain
 */

import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TranslationKey } from "@/i18n/core/static-types";

import { csvImportJobs, importBatches } from "../leads/import/db";
import type {
  CsvImportConfig,
  DomainImportRepository,
  ImportJobsListRequestType,
  ImportJobsListResponseType,
  ImportJobUpdateResponseType,
  LeadsImportResponseOutput,
  NewCsvImportJob,
  NewImportBatch,
} from "../leads/import/definition";
import { CsvImportJobStatus } from "../leads/import/definition";
import type { DomainRecord, ImportRepository } from "./types";

/**
 * Generic Import Repository Implementation
 */
export class ImportRepositoryImpl implements ImportRepository {
  /**
   * Import records from CSV (immediate processing)
   */
  async importFromCsv<T extends DomainRecord>(
    config: CsvImportConfig,
    uploadedBy: DbId,
    domainRepository: DomainImportRepository<T>,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsImportResponseOutput>> {
    try {
      logger.debug("Starting CSV import", {
        fileName: config.fileName,
        uploadedBy,
        useChunkedProcessing: config.useChunkedProcessing,
        domain: domainRepository.getDomainName(),
      });

      // Check if chunked processing is requested
      if (config.useChunkedProcessing) {
        return await this.createChunkedImportJob(
          config,
          uploadedBy,
          domainRepository.getDomainName(),
          logger,
        );
      }

      // Decode and parse CSV
      const csvContent = Buffer.from(config.file, "base64").toString("utf-8");
      const rows = this.parseCsv(csvContent);

      if (rows.length === 0) {
        return createErrorResponse(
          "leadsErrors.leadsImport.post.error.validation.title",
          ErrorResponseTypes.BAD_REQUEST,
        );
      }

      // Create import batch record
      const batchData: NewImportBatch = {
        fileName: config.fileName,
        uploadedBy,
        totalRows: rows.length,
        successfulImports: 0,
        failedImports: 0,
        duplicateEmails: 0,
        importErrors: [],
        importSummary: {},
        domain: domainRepository.getDomainName(),
        domainConfig: {
          file: config.file,
          fileName: config.fileName,
          skipDuplicates: config.skipDuplicates,
          updateExisting: config.updateExisting,
          defaultCountry: config.defaultCountry,
          defaultLanguage: config.defaultLanguage,
          useChunkedProcessing: config.useChunkedProcessing,
          batchSize: config.batchSize,
        },
      };

      const [batch] = await db
        .insert(importBatches)
        .values(batchData)
        .returning();

      // Process rows
      const results = await this.processImportRows(
        rows,
        config,
        domainRepository,
      );

      // Update batch with final results
      await db
        .update(importBatches)
        .set({
          successfulImports: results.successfulImports,
          failedImports: results.failedImports,
          duplicateEmails: results.duplicateEmails,
          importErrors: results.errors.map((e) => e.error),
          importSummary: results.summary,
        })
        .where(eq(importBatches.id, batch.id));

      logger.debug("CSV import completed", {
        batchId: batch.id,
        totalRows: rows.length,
        successful: results.successfulImports,
        failed: results.failedImports,
        duplicates: results.duplicateEmails,
      });

      return createSuccessResponse({
        batchId: batch.id,
        totalRows: rows.length,
        successfulImports: results.successfulImports,
        failedImports: results.failedImports,
        duplicateEmails: results.duplicateEmails,
        errors: results.errors,
        summary: results.summary,
        isChunkedProcessing: false,
      });
    } catch (error) {
      logger.error("Error importing CSV", error);
      return createErrorResponse(
        "leadsErrors.leadsImport.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Create a chunked import job
   */
  async createChunkedImportJob(
    config: CsvImportConfig,
    uploadedBy: DbId,
    domainName: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsImportResponseOutput>> {
    try {
      // Decode CSV to get total rows
      const csvContent = Buffer.from(config.file, "base64").toString("utf-8");
      const rows = this.parseCsv(csvContent);
      const totalRows = rows.length;

      // Create the import job
      const newJob: NewCsvImportJob = {
        fileName: config.fileName,
        fileContent: config.file,
        uploadedBy,
        skipDuplicates: config.skipDuplicates,
        updateExisting: config.updateExisting,
        defaultCountry: config.defaultCountry,
        defaultLanguage: config.defaultLanguage,
        batchSize: config.batchSize,
        totalRows,
        status: CsvImportJobStatus.PENDING,
        processedRows: 0,
        successfulImports: 0,
        failedImports: 0,
        duplicateEmails: 0,
        currentBatchStart: 0,
        importErrors: [],
        importSummary: {},
        error: null,
        retryCount: 0,
        maxRetries: 3,
        domain: domainName,
        domainConfig: {
          file: config.file,
          fileName: config.fileName,
          skipDuplicates: config.skipDuplicates,
          updateExisting: config.updateExisting,
          defaultCountry: config.defaultCountry,
          defaultLanguage: config.defaultLanguage,
          useChunkedProcessing: config.useChunkedProcessing,
          batchSize: config.batchSize,
        },
      };

      const [createdJob] = await db
        .insert(csvImportJobs)
        .values(newJob)
        .returning();

      if (!createdJob) {
        return createErrorResponse(
          "leadsErrors.leadsImport.post.error.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      return createSuccessResponse({
        batchId: createdJob.id,
        totalRows,
        successfulImports: 0,
        failedImports: 0,
        duplicateEmails: 0,
        errors: [],
        summary: {
          newLeads: 0,
          updatedLeads: 0,
          skippedDuplicates: 0,
        },
        isChunkedProcessing: true,
        jobId: createdJob.id,
      });
    } catch (error) {
      logger.error("Error creating chunked import job", error);
      return createErrorResponse(
        "leadsErrors.leadsImport.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get CSV import job status
   */
  async getCsvImportJobStatus(
    jobId: string,
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImportJobsListResponseType[0]>> {
    try {
      const job = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!job[0]) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const jobData = job[0];
      return createSuccessResponse({
        id: jobData.id,
        fileName: jobData.fileName,
        status: jobData.status,
        totalRows: jobData.totalRows,
        processedRows: jobData.processedRows,
        successfulImports: jobData.successfulImports,
        failedImports: jobData.failedImports,
        duplicateEmails: jobData.duplicateEmails,
        currentBatchStart: jobData.currentBatchStart,
        batchSize: jobData.batchSize,
        error: jobData.error,
        retryCount: jobData.retryCount,
        maxRetries: jobData.maxRetries,
        createdAt: jobData.createdAt.toISOString(),
        updatedAt: jobData.updatedAt.toISOString(),
        startedAt: jobData.startedAt?.toISOString() || null,
        completedAt: jobData.completedAt?.toISOString() || null,
      });
    } catch (error) {
      logger.error("Error getting CSV import job status", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Process a batch of a chunked import job
   */
  async processBatch<T extends DomainRecord>(
    jobId: string,
    domainRepository: DomainImportRepository<T>,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ processed: number; hasMore: boolean }>> {
    try {
      // Get the job
      const [job] = await db
        .select()
        .from(csvImportJobs)
        .where(eq(csvImportJobs.id, jobId))
        .limit(1);

      if (!job) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      if (
        job.status === CsvImportJobStatus.COMPLETED ||
        job.status === CsvImportJobStatus.FAILED
      ) {
        return createSuccessResponse({ processed: 0, hasMore: false });
      }

      // Update status to processing if it's pending
      if (job.status === CsvImportJobStatus.PENDING) {
        await db
          .update(csvImportJobs)
          .set({ status: CsvImportJobStatus.PROCESSING, startedAt: new Date() })
          .where(eq(csvImportJobs.id, jobId));
      }

      // Parse CSV and get the batch to process
      const csvContent = Buffer.from(job.fileContent, "base64").toString(
        "utf-8",
      );
      const allRows = this.parseCsv(csvContent);

      const batchEnd = Math.min(
        job.currentBatchStart + job.batchSize,
        allRows.length,
      );
      const batchRows = allRows.slice(job.currentBatchStart, batchEnd);

      if (batchRows.length === 0) {
        // Mark as completed
        await db
          .update(csvImportJobs)
          .set({
            status: CsvImportJobStatus.COMPLETED,
            completedAt: new Date(),
          })
          .where(eq(csvImportJobs.id, jobId));

        return createSuccessResponse({ processed: 0, hasMore: false });
      }

      // Process the batch
      const config: CsvImportConfig = {
        file: job.fileContent,
        fileName: job.fileName,
        skipDuplicates: job.skipDuplicates,
        updateExisting: job.updateExisting,
        defaultCountry: job.defaultCountry,
        defaultLanguage: job.defaultLanguage,
        defaultStatus: job.defaultStatus,
        defaultCampaignStage: job.defaultCampaignStage,
        defaultSource: job.defaultSource,
        useChunkedProcessing: true,
        batchSize: job.batchSize,
      };

      const results = await this.processImportRows(
        batchRows,
        config,
        domainRepository,
      );

      // Update job progress
      const newProcessedRows = job.processedRows + batchRows.length;
      const newCurrentBatchStart = job.currentBatchStart + job.batchSize;
      const hasMore = newCurrentBatchStart < allRows.length;
      const newStatus = hasMore
        ? CsvImportJobStatus.PROCESSING
        : CsvImportJobStatus.COMPLETED;

      await db
        .update(csvImportJobs)
        .set({
          processedRows: newProcessedRows,
          successfulImports: job.successfulImports + results.successfulImports,
          failedImports: job.failedImports + results.failedImports,
          duplicateEmails: job.duplicateEmails + results.duplicateEmails,
          currentBatchStart: newCurrentBatchStart,
          status: newStatus,
          completedAt: hasMore ? undefined : new Date(),
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      return createSuccessResponse({
        processed: batchRows.length,
        hasMore,
      });
    } catch (error) {
      logger.error("Error processing batch", error);

      // Mark job as failed
      await db
        .update(csvImportJobs)
        .set({
          status: CsvImportJobStatus.FAILED,
          error: parseError(error).message,
          retryCount: sql`${csvImportJobs.retryCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      return createErrorResponse(
        "leadsErrors.leadsImport.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Parse CSV content into rows
   */
  private parseCsv(csvContent: string): Record<string, string>[] {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      return [];
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      rows.push(row);
    }

    return rows;
  }

  /**
   * Process import rows with domain-specific logic
   */
  private async processImportRows<T extends DomainRecord>(
    rows: Record<string, string>[],
    config: CsvImportConfig,
    domainRepository: DomainImportRepository<T>,
  ): Promise<{
    successfulImports: number;
    failedImports: number;
    duplicateEmails: number;
    errors: Array<{ row: number; email?: string; error: string }>;
    summary: {
      newLeads: number;
      updatedLeads: number;
      skippedDuplicates: number;
    };
  }> {
    let successfulImports = 0;
    let failedImports = 0;
    let duplicateEmails = 0;
    let newLeads = 0;
    let updatedLeads = 0;
    let skippedDuplicates = 0;
    const errors: Array<{ row: number; email?: string; error: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because CSV has header row and we're 0-indexed

      try {
        // Validate the row
        const validation = await domainRepository.validateCsvRow(row, config);

        if (!validation.isValid) {
          errors.push({
            row: rowNumber,
            email: row.email,
            error: validation.errors.map(String).join(", "),
          });
          failedImports++;
          continue;
        }

        // Check for duplicates if needed
        if (config.skipDuplicates) {
          const exists = await domainRepository.recordExistsByEmail(row.email);
          if (exists) {
            duplicateEmails++;
            skippedDuplicates++;
            continue;
          }
        }

        // Create or update the record
        const result = await domainRepository.createOrUpdateRecord(
          validation.data as T,
          config,
        );

        if (result.success) {
          successfulImports++;
          if (result.data.created) {
            newLeads++;
          }
          if (result.data.updated) {
            updatedLeads++;
          }
          if (result.data.duplicate) {
            duplicateEmails++;
            skippedDuplicates++;
          }
        } else {
          errors.push({
            row: rowNumber,
            email: row.email,
            error: "leadsErrors.leadsImport.post.error.processing.title",
          });
          failedImports++;
        }
      } catch (error) {
        errors.push({
          row: rowNumber,
          email: row.email,
          error: parseError(error).message,
        });
        failedImports++;
      }
    }

    return {
      successfulImports,
      failedImports,
      duplicateEmails,
      errors,
      summary: { newLeads, updatedLeads, skippedDuplicates },
    };
  }

  /**
   * Import CSV wrapper for route handlers
   * NOTE: This is a placeholder. Domain-specific import should use importFromCsv with domain repository
   */
  importCsv(): ResponseType<LeadsImportResponseOutput> {
    return createErrorResponse(
      "leadsErrors.leadsImport.post.error.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }

  /**
   * List import jobs for a user with filtering
   */
  async listImportJobs(
    userId: DbId,
    options: ImportJobsListRequestType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImportJobsListResponseType>> {
    try {
      const { status = "all", limit = 50, offset = 0 } = options;

      // Build where conditions
      const whereConditions = [eq(csvImportJobs.uploadedBy, userId)];

      if (status !== "all") {
        whereConditions.push(eq(csvImportJobs.status, status));
      }

      const jobs = await db
        .select()
        .from(csvImportJobs)
        .where(and(...whereConditions))
        .orderBy(desc(csvImportJobs.createdAt))
        .limit(limit)
        .offset(offset);

      // Transform database results to match API response format
      const transformedJobs = jobs.map((job) => ({
        id: job.id,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        error: job.error,
        retryCount: job.retryCount,
        fileName: job.fileName,
        batchSize: job.batchSize,
        totalRows: job.totalRows,
        processedRows: job.processedRows,
        successfulImports: job.successfulImports,
        failedImports: job.failedImports,
        duplicateEmails: job.duplicateEmails,
        currentBatchStart: job.currentBatchStart,
        maxRetries: job.maxRetries,
        startedAt: job.startedAt?.toISOString() || null,
        completedAt: job.completedAt?.toISOString() || null,
      }));

      return createSuccessResponse(transformedJobs);
    } catch (error) {
      logger.error("Error listing import jobs", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update import job settings
   */
  async updateImportJob(
    userId: DbId,
    updates: {
      jobId: string;
      batchSize?: number;
      maxRetries?: number;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<ImportJobUpdateResponseType>> {
    try {
      // First verify the job belongs to the user
      const existingJob = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, updates.jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (existingJob.length === 0) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.server.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const existingJobData = existingJob[0];

      // Don't allow updates to completed or failed jobs
      if (
        existingJobData.status === CsvImportJobStatus.COMPLETED ||
        existingJobData.status === CsvImportJobStatus.FAILED
      ) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.server.title",
          ErrorResponseTypes.CONFLICT,
        );
      }

      // Update the job
      const updatedJobs = await db
        .update(csvImportJobs)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, updates.jobId))
        .returning();

      if (updatedJobs.length === 0) {
        return createErrorResponse(
          "leadsErrors.leadsImport.post.error.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      const job = updatedJobs[0];
      return createSuccessResponse({
        id: job.id,
        fileName: job.fileName,
        status: job.status,
        totalRows: job.totalRows,
        processedRows: job.processedRows,
        successfulImports: job.successfulImports,
        failedImports: job.failedImports,
        duplicateEmails: job.duplicateEmails,
        currentBatchStart: job.currentBatchStart,
        batchSize: job.batchSize,
        error: job.error,
        retryCount: job.retryCount,
        maxRetries: job.maxRetries,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        startedAt: job.startedAt?.toISOString() || null,
        completedAt: job.completedAt?.toISOString() || null,
      });
    } catch (error) {
      logger.error("Error updating import job", error);
      return createErrorResponse(
        "leadsErrors.leadsImport.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Delete an import job
   */
  async deleteImportJob(
    userId: DbId,
    jobId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: TranslationKey }>> {
    try {
      // Verify job exists and belongs to user
      const existingJob = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        );

      if (existingJob.length === 0) {
        return createErrorResponse(
          "leadsErrors.leadsImport.delete.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Delete the job
      await db.delete(csvImportJobs).where(eq(csvImportJobs.id, jobId));

      return createSuccessResponse({
        success: true,
        message: "leadsErrors.leadsImport.delete.success.description",
      });
    } catch (error) {
      logger.error("Error deleting import job:", error);
      return createErrorResponse(
        "leadsErrors.leadsImport.delete.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Perform actions on import jobs (stop, retry)
   */
  async performJobAction(
    userId: DbId,
    jobId: string,
    action: "stop" | "retry",
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: TranslationKey }>> {
    try {
      // First verify the job belongs to the user
      const existingJob = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (existingJob.length === 0) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.server.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const job = existingJob[0];

      switch (action) {
        case "stop":
          if (
            job.status !== CsvImportJobStatus.PROCESSING &&
            job.status !== CsvImportJobStatus.PENDING
          ) {
            return createErrorResponse(
              "leadsErrors.leads.get.error.server.title",
              ErrorResponseTypes.CONFLICT,
            );
          }

          await db
            .update(csvImportJobs)
            .set({
              status: CsvImportJobStatus.FAILED,
              error: "leadsErrors.leadsImport.post.error.stopped_by_user",
              updatedAt: new Date(),
              completedAt: new Date(),
            })
            .where(eq(csvImportJobs.id, jobId));

          return createSuccessResponse({
            success: true,
            message: "leadsErrors.leadsImport.post.success.job_stopped",
          });

        case "retry":
          if (job.status !== CsvImportJobStatus.FAILED) {
            return createErrorResponse(
              "leadsErrors.leads.get.error.server.title",
              ErrorResponseTypes.CONFLICT,
            );
          }

          await db
            .update(csvImportJobs)
            .set({
              status: CsvImportJobStatus.PENDING,
              error: null,
              retryCount: 0,
              updatedAt: new Date(),
              startedAt: null,
              completedAt: null,
            })
            .where(eq(csvImportJobs.id, jobId));

          return createSuccessResponse({
            success: true,
            message: "leadsErrors.leadsImport.post.success.job_queued_retry",
          });

        default:
          return createErrorResponse(
            "leadsErrors.leads.get.error.server.title",
            ErrorResponseTypes.VALIDATION_ERROR,
          );
      }
    } catch (error) {
      logger.error("Error performing job action", error);
      return createErrorResponse(
        "leadsErrors.leadsImport.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Singleton instance
 */
export const importRepository = new ImportRepositoryImpl();
