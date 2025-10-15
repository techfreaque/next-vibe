/**
 * Import Hooks
 * Business logic hooks for import operations with UI-friendly error handling
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { Countries, Languages } from "@/i18n/core/config";

import {
  EmailCampaignStage,
  type EmailCampaignStageValues,
  LeadSource,
  type LeadSourceValues,
  LeadStatus,
  type LeadStatusValues,
} from "../leads/enum";
import type {
  CsvImportConfig,
  ImportJobsListRequestType,
  ImportJobsListResponseType,
  LeadsImportResponseOutput,
} from "../leads/import/definition";
import type {
  ImportCsvRequestOutput,
  ImportCsvResponseOutput,
} from "./definition";
import { getRecommendedBatchSize, ImportDomain } from "./enum";
import { importRepository } from "./repository";

/**
 * Import CSV Hook
 * Handles CSV import operations with domain-specific routing
 */
export async function useImportCsv(
  request: ImportCsvRequestOutput,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<ImportCsvResponseOutput>> {
  try {
    logger.debug("Starting CSV import", {
      fileName: request.fileUploadSection.fileName,
      domain: request.fileUploadSection.domain,
      fileSize: request.fileUploadSection.file.length,
      useChunkedProcessing: request.processingSection.useChunkedProcessing,
      userId,
    });

    // === INPUT VALIDATION ===
    const validationResult = validateImportRequest(request, logger);
    if (!validationResult.isValid) {
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    // === FILE SIZE OPTIMIZATION ===
    const optimizedRequest = optimizeImportSettings(request, logger);

    // === DOMAIN-SPECIFIC PROCESSING ===
    const result = await routeImportToDomain(optimizedRequest, userId, logger);

    if (result.success) {
      logger.info("CSV import completed successfully", {
        batchId: result.data.importResult.basicResults.batchId,
        totalRows: result.data.importResult.basicResults.totalRows,
        successful: result.data.importResult.statistics.successfulImports,
        failed: result.data.importResult.statistics.failedImports,
        domain: request.fileUploadSection.domain,
      });
    }

    return result;
  } catch (error) {
    logger.error("Error in CSV import hook", error);
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * List Import Jobs Hook
 * Retrieves import job history with user-friendly formatting
 */
export async function useListImportJobs(
  request: ImportJobsListRequestType,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<{ jobs: ImportJobsListResponseType }>> {
  try {
    // Use defaults for optional parameters
    const status = request.status ?? "all";
    const limit = request.limit ?? 20;
    const offset = request.offset ?? 0;

    logger.debug("Fetching import jobs", {
      status,
      limit,
      offset,
      userId,
    });

    // === FETCH JOBS FROM REPOSITORY ===
    const jobsResult = await importRepository.listImportJobs(
      userId,
      {
        status: status === "all" ? undefined : status,
        limit,
        offset,
      },
      logger,
    );

    if (!jobsResult.success) {
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }

    // Extract data after success check for type narrowing
    const jobs: ImportJobsListResponseType = jobsResult.data;

    logger.info("Successfully fetched import jobs", {
      count: jobs.length,
      totalRequested: limit,
    });

    return createSuccessResponse({ jobs });
  } catch (error) {
    logger.error("Error fetching import jobs", error);
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
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
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
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
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
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

    const result = await importRepository.deleteImportJob(
      userId,
      jobId,
      logger,
    );

    if (result.success) {
      logger.info("Import job deleted successfully", { jobId });
    }

    return result;
  } catch (error) {
    logger.error("Error deleting import job", error);
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
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
): Promise<ResponseType<ImportJobsListResponseType[0]>> {
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
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

// === HELPER FUNCTIONS ===

/**
 * Validate import request parameters
 */
function validateImportRequest(
  request: ImportCsvRequestOutput,
  logger: EndpointLogger,
): { isValid: boolean; errorMessage: string } {
  // Check file content
  if (
    !request.fileUploadSection.file ||
    request.fileUploadSection.file.length === 0
  ) {
    return {
      isValid: false,
      // eslint-disable-next-line i18next/no-literal-string
      errorMessage: "Empty file",
    };
  }

  // Check file name
  if (
    !request.fileUploadSection.fileName ||
    request.fileUploadSection.fileName.trim().length === 0
  ) {
    return {
      isValid: false,
      // eslint-disable-next-line i18next/no-literal-string
      errorMessage: "Empty file name",
    };
  }

  // Check domain
  if (!Object.values(ImportDomain).includes(request.fileUploadSection.domain)) {
    return {
      isValid: false,
      // eslint-disable-next-line i18next/no-literal-string
      errorMessage: "Invalid domain",
    };
  }

  // Check batch size if chunked processing
  if (
    request.processingSection.useChunkedProcessing &&
    (request.processingSection.batchSize < 10 ||
      request.processingSection.batchSize > 1000)
  ) {
    return {
      isValid: false,
      // eslint-disable-next-line i18next/no-literal-string
      errorMessage: "Invalid batch size",
    };
  }

  // Estimate file size (base64 is ~1.33x original size)
  const estimatedFileSize = (request.fileUploadSection.file.length * 3) / 4;
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (estimatedFileSize > maxFileSize) {
    return {
      isValid: false,
      // eslint-disable-next-line i18next/no-literal-string
      errorMessage: "File too large",
    };
  }

  logger.debug("Import request validation passed", {
    fileName: request.fileUploadSection.fileName,
    domain: request.fileUploadSection.domain,
    estimatedFileSize,
    batchSize: request.processingSection.batchSize,
  });

  return { isValid: true, errorMessage: "" };
}

/**
 * Optimize import settings based on file size and content
 */
function optimizeImportSettings(
  request: ImportCsvRequestOutput,
  logger: EndpointLogger,
): ImportCsvRequestOutput {
  const optimized = { ...request };

  // Estimate number of rows from file size
  const estimatedFileSize = (request.fileUploadSection.file.length * 3) / 4;
  const estimatedRows = Math.floor(estimatedFileSize / 100); // Rough estimate

  // Auto-enable chunked processing for large files
  if (estimatedRows > 500 && !request.processingSection.useChunkedProcessing) {
    logger.info("Auto-enabling chunked processing for large file", {
      estimatedRows,
      originalBatchSize: request.processingSection.batchSize,
    });

    optimized.processingSection = {
      ...optimized.processingSection,
      useChunkedProcessing: true,
      batchSize: getRecommendedBatchSize(estimatedRows),
    };
  }

  // Optimize batch size if not specified or too large
  if (
    optimized.processingSection.useChunkedProcessing &&
    optimized.processingSection.batchSize > 500
  ) {
    const recommendedSize = getRecommendedBatchSize(estimatedRows);
    if (recommendedSize < optimized.processingSection.batchSize) {
      logger.info("Optimizing batch size for better performance", {
        originalSize: optimized.processingSection.batchSize,
        recommendedSize,
        estimatedRows,
      });
      optimized.processingSection = {
        ...optimized.processingSection,
        batchSize: recommendedSize,
      };
    }
  }

  return optimized;
}

/**
 * Route import to appropriate domain-specific handler
 */
async function routeImportToDomain(
  request: ImportCsvRequestOutput,
  userId: DbId,
  logger: EndpointLogger,
): Promise<ResponseType<ImportCsvResponseOutput>> {
  try {
    // For now, route all imports to the leads domain
    // This will be expanded to handle other domains
    const { leadsImportRepository } = await import(
      "../leads/import/repository"
    );

    // Convert generic import config to domain-specific config
    const config: CsvImportConfig = {
      file: request.fileUploadSection.file,
      fileName: request.fileUploadSection.fileName,
      skipDuplicates: request.processingSection.skipDuplicates,
      updateExisting: request.processingSection.updateExisting,
      defaultCountry: request.defaultsSection.defaultCountry as Countries,
      defaultLanguage: request.defaultsSection.defaultLanguage as Languages,
      useChunkedProcessing: request.processingSection.useChunkedProcessing,
      batchSize: request.processingSection.batchSize,
      // Use defaults for domain-specific fields
      defaultStatus: LeadStatus.NEW as typeof LeadStatusValues,
      defaultCampaignStage:
        EmailCampaignStage.NOT_STARTED as typeof EmailCampaignStageValues,
      defaultSource: LeadSource.CSV_IMPORT as typeof LeadSourceValues,
    };

    const result = await importRepository.importFromCsv(
      config,
      userId,
      leadsImportRepository,
      logger,
    );

    if (!result.success) {
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }

    // Extract data after success check with explicit typing
    const importData: LeadsImportResponseOutput = result.data;

    // Transform response to match our UI-optimized structure
    const transformedResponse: ImportCsvResponseOutput = {
      importResult: {
        basicResults: {
          batchId: importData.batchId,
          totalRows: importData.totalRows,
          isChunkedProcessing: importData.isChunkedProcessing,
          jobId: importData.jobId,
        },
        statistics: {
          successfulImports: importData.successfulImports,
          failedImports: importData.failedImports,
          duplicateEmails: importData.duplicateEmails,
        },
        summary: {
          newRecords: importData.summary.newLeads || 0,
          updatedRecords: importData.summary.updatedLeads || 0,
          skippedDuplicates: importData.summary.skippedDuplicates,
        },
        errors: importData.errors,
        nextSteps: generateNextSteps(
          importData,
          request.fileUploadSection.domain,
        ),
      },
    };

    return createSuccessResponse(transformedResponse);
  } catch (error) {
    logger.error("Error routing import to domain", {
      domain: request.fileUploadSection.domain,
      error,
    });
    return createErrorResponse(
      "error.default",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}

/**
 * Generate helpful next steps for the user
 */
function generateNextSteps(
  result: LeadsImportResponseOutput,
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
