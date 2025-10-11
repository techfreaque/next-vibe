/**
 * Import Hooks
 * Business logic hooks for import operations with UI-friendly error handling
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { importRepository } from "./repository";
import type {
  ImportCsvRequestType,
  ImportCsvResponseType,
  ListImportJobsRequestType,
  ListImportJobsResponseType,
} from "./definition";
import { getRecommendedBatchSize, ImportDomain, isJobInProgress } from "./enum";

/**
 * Import CSV Hook
 * Handles CSV import operations with domain-specific routing
 */
export async function useImportCsv(
  request: ImportCsvRequestType,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<ImportCsvResponseType>> {
  try {
    logger.debug("Starting CSV import", {
      fileName: request.fileName,
      domain: request.domain,
      fileSize: request.file.length,
      useChunkedProcessing: request.useChunkedProcessing,
      userId,
    });

    // === INPUT VALIDATION ===
    const validationResult = validateImportRequest(request, logger);
    if (!validationResult.isValid) {
      return createErrorResponse(
        validationResult.errorMessage,
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    // === FILE SIZE OPTIMIZATION ===
    const optimizedRequest = optimizeImportSettings(request, logger);

    // === DOMAIN-SPECIFIC PROCESSING ===
    const result = await routeImportToDomain(
      optimizedRequest,
      userId,
      logger,
    );

    if (result.success) {
      logger.info("CSV import completed successfully", {
        batchId: result.data.basicResults.batchId,
        totalRows: result.data.basicResults.totalRows,
        successful: result.data.statistics.successfulImports,
        failed: result.data.statistics.failedImports,
        domain: request.domain,
      });
    }

    return result;
  } catch (error) {
    logger.error("Error in CSV import hook", error);
    return createErrorResponse(
      "app.api.v1.core.import.csv.post.errors.server.title",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * List Import Jobs Hook
 * Retrieves import job history with user-friendly formatting
 */
export async function useListImportJobs(
  request: ListImportJobsRequestType,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<ListImportJobsResponseType>> {
  try {
    logger.debug("Fetching import jobs", {
      status: request.status,
      limit: request.limit,
      offset: request.offset,
      userId,
    });

    // === FETCH JOBS FROM REPOSITORY ===
    const jobsResult = await importRepository.listImportJobs(
      userId,
      {
        status: request.status,
        limit: request.limit,
        offset: request.offset,
      },
      logger,
    );

    if (!jobsResult.success) {
      return jobsResult as ResponseType<ListImportJobsResponseType>;
    }

    // === TRANSFORM TO UI-FRIENDLY FORMAT ===
    const transformedJobs = jobsResult.data.map(job => ({
      id: job.id,
      fileName: job.fileName,
      domain: job.domain || "unknown",
      status: job.status,
      
      // === PROGRESS CALCULATION ===
      progress: {
        totalRows: job.totalRows,
        processedRows: job.processedRows,
        currentBatchStart: job.currentBatchStart,
        batchSize: job.batchSize,
        percentComplete: Math.round((job.processedRows / job.totalRows) * 100),
      },
      
      // === RESULTS SUMMARY ===
      results: {
        successfulImports: job.successfulImports,
        failedImports: job.failedImports,
        duplicateEmails: job.duplicateEmails,
      },
      
      // === TIMING INFORMATION ===
      timing: {
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
      },
      
      // === ERROR HANDLING ===
      errorInfo: {
        error: job.error,
        retryCount: job.retryCount,
        maxRetries: job.maxRetries,
      },
    }));

    logger.info("Successfully fetched import jobs", {
      count: transformedJobs.length,
      totalRequested: request.limit,
    });

    return createSuccessResponse(transformedJobs);
  } catch (error) {
    logger.error("Error fetching import jobs", error);
    return createErrorResponse(
      "app.api.v1.core.import.jobs.get.errors.server.title",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * Cancel Import Job Hook
 * Cancels a running import job
 */
export async function useCancelImportJob(
  jobId: string,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<{ success: boolean; message: string }>> {
  try {
    logger.debug("Cancelling import job", { jobId, userId });

    const result = await importRepository.performJobAction(
      userId,
      jobId,
      "stop",
      logger,
    );

    if (result.success) {
      logger.info("Import job cancelled successfully", { jobId });
    }

    return result;
  } catch (error) {
    logger.error("Error cancelling import job", error);
    return createErrorResponse(
      "app.api.v1.core.import.errors.cancel.server",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * Retry Import Job Hook
 * Retries a failed import job
 */
export async function useRetryImportJob(
  jobId: string,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<{ success: boolean; message: string }>> {
  try {
    logger.debug("Retrying import job", { jobId, userId });

    const result = await importRepository.performJobAction(
      userId,
      jobId,
      "retry",
      logger,
    );

    if (result.success) {
      logger.info("Import job retry initiated", { jobId });
    }

    return result;
  } catch (error) {
    logger.error("Error retrying import job", error);
    return createErrorResponse(
      "app.api.v1.core.import.errors.retry.server",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * Delete Import Job Hook
 * Deletes an import job and its data
 */
export async function useDeleteImportJob(
  jobId: string,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<{ success: boolean; message: string }>> {
  try {
    logger.debug("Deleting import job", { jobId, userId });

    const result = await importRepository.deleteImportJob(userId, jobId, logger);

    if (result.success) {
      logger.info("Import job deleted successfully", { jobId });
    }

    return result;
  } catch (error) {
    logger.error("Error deleting import job", error);
    return createErrorResponse(
      "app.api.v1.core.import.errors.delete.server",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * Get Import Job Status Hook
 * Retrieves detailed status of a specific import job
 */
export async function useGetImportJobStatus(
  jobId: string,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<any>> {
  try {
    logger.debug("Getting import job status", { jobId, userId });

    const result = await importRepository.getCsvImportJobStatus(
      jobId,
      userId,
      logger,
    );

    return result;
  } catch (error) {
    logger.error("Error getting import job status", error);
    return createErrorResponse(
      "app.api.v1.core.import.errors.status.server",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

// === HELPER FUNCTIONS ===

/**
 * Validate import request parameters
 */
function validateImportRequest(
  request: ImportCsvRequestType,
  logger: EndpointLogger,
): { isValid: boolean; errorMessage: string } {
  // Check file content
  if (!request.file || request.file.length === 0) {
    return {
      isValid: false,
      errorMessage: "app.api.v1.core.import.csv.post.errors.validation.emptyFile",
    };
  }

  // Check file name
  if (!request.fileName || request.fileName.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: "app.api.v1.core.import.csv.post.errors.validation.emptyFileName",
    };
  }

  // Check domain
  if (!Object.values(ImportDomain).includes(request.domain)) {
    return {
      isValid: false,
      errorMessage: "app.api.v1.core.import.csv.post.errors.validation.invalidDomain",
    };
  }

  // Check batch size if chunked processing
  if (request.useChunkedProcessing && (request.batchSize < 10 || request.batchSize > 1000)) {
    return {
      isValid: false,
      errorMessage: "app.api.v1.core.import.csv.post.errors.validation.invalidBatchSize",
    };
  }

  // Estimate file size (base64 is ~1.33x original size)
  const estimatedFileSize = (request.file.length * 3) / 4;
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (estimatedFileSize > maxFileSize) {
    return {
      isValid: false,
      errorMessage: "app.api.v1.core.import.csv.post.errors.validation.fileTooLarge",
    };
  }

  logger.debug("Import request validation passed", {
    fileName: request.fileName,
    domain: request.domain,
    estimatedFileSize,
    batchSize: request.batchSize,
  });

  return { isValid: true, errorMessage: "" };
}

/**
 * Optimize import settings based on file size and content
 */
function optimizeImportSettings(
  request: ImportCsvRequestType,
  logger: EndpointLogger,
): ImportCsvRequestType {
  const optimized = { ...request };

  // Estimate number of rows from file size
  const estimatedFileSize = (request.file.length * 3) / 4;
  const estimatedRows = Math.floor(estimatedFileSize / 100); // Rough estimate

  // Auto-enable chunked processing for large files
  if (estimatedRows > 500 && !request.useChunkedProcessing) {
    logger.info("Auto-enabling chunked processing for large file", {
      estimatedRows,
      originalBatchSize: request.batchSize,
    });
    
    optimized.useChunkedProcessing = true;
    optimized.batchSize = getRecommendedBatchSize(estimatedRows);
  }

  // Optimize batch size if not specified or too large
  if (optimized.useChunkedProcessing && optimized.batchSize > 500) {
    const recommendedSize = getRecommendedBatchSize(estimatedRows);
    if (recommendedSize < optimized.batchSize) {
      logger.info("Optimizing batch size for better performance", {
        originalSize: optimized.batchSize,
        recommendedSize,
        estimatedRows,
      });
      optimized.batchSize = recommendedSize;
    }
  }

  return optimized;
}

/**
 * Route import to appropriate domain-specific handler
 */
async function routeImportToDomain(
  request: ImportCsvRequestType,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<ImportCsvResponseType>> {
  try {
    // For now, route all imports to the leads domain
    // This will be expanded to handle other domains
    const { importRepository: leadsImportRepository } = await import("../leads/import/repository");
    
    // Convert generic import config to domain-specific config
    const config = {
      file: request.file,
      fileName: request.fileName,
      skipDuplicates: request.skipDuplicates,
      updateExisting: request.updateExisting,
      defaultCountry: request.defaultCountry,
      defaultLanguage: request.defaultLanguage,
      useChunkedProcessing: request.useChunkedProcessing,
      batchSize: request.batchSize,
      // Use defaults for domain-specific fields
      defaultStatus: "new",
      defaultCampaignStage: "not_started",
      defaultSource: "csv_import",
    };

    const result = await importRepository.importFromCsv(
      config,
      userId,
      leadsImportRepository,
      logger,
    );

    if (!result.success) {
      return result as ResponseType<ImportCsvResponseType>;
    }

    // Transform response to match our UI-optimized structure
    const transformedResponse: ImportCsvResponseType = {
      basicResults: {
        batchId: result.data.batchId,
        totalRows: result.data.totalRows,
        isChunkedProcessing: result.data.isChunkedProcessing,
        jobId: result.data.jobId,
      },
      statistics: {
        successfulImports: result.data.successfulImports,
        failedImports: result.data.failedImports,
        duplicateEmails: result.data.duplicateEmails,
      },
      summary: {
        newRecords: result.data.summary.newLeads,
        updatedRecords: result.data.summary.updatedLeads,
        skippedDuplicates: result.data.summary.skippedDuplicates,
      },
      errors: result.data.errors,
      nextSteps: generateNextSteps(result.data, request.domain),
    };

    return createSuccessResponse(transformedResponse);
  } catch (error) {
    logger.error("Error routing import to domain", { domain: request.domain, error });
    return createErrorResponse(
      "app.api.v1.core.import.csv.post.errors.server.title",
      ErrorResponseTypes.SERVER_ERROR,
    );
  }
}

/**
 * Generate helpful next steps for the user
 */
function generateNextSteps(
  result: any,
  domain: ImportDomain,
): string[] {
  const steps: string[] = [];

  // Add steps based on results
  if (result.failedImports > 0) {
    steps.push("app.api.v1.core.import.nextSteps.reviewErrors");
  }

  if (result.duplicateEmails > 0) {
    steps.push("app.api.v1.core.import.nextSteps.checkDuplicates");
  }

  if (result.successfulImports > 0) {
    switch (domain) {
      case ImportDomain.LEADS:
        steps.push("app.api.v1.core.import.nextSteps.reviewLeads");
        steps.push("app.api.v1.core.import.nextSteps.startCampaign");
        break;
      case ImportDomain.CONTACTS:
        steps.push("app.api.v1.core.import.nextSteps.reviewContacts");
        steps.push("app.api.v1.core.import.nextSteps.organizeContacts");
        break;
      default:
        steps.push("app.api.v1.core.import.nextSteps.reviewImported");
    }
  }

  if (result.isChunkedProcessing) {
    steps.push("app.api.v1.core.import.nextSteps.monitorProgress");
  }

  // Always add general guidance
  steps.push("app.api.v1.core.import.nextSteps.checkJobsList");

  return steps;
}