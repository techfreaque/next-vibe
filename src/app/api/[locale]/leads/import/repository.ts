/**
 * Leads-specific Import Repository
 * Implements domain-specific logic for importing leads
 */

import "server-only";

import { eq } from "drizzle-orm";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, Languages } from "@/i18n/core/config";

import { importRepository } from "../../import/repository";
import type { DomainRecord } from "../../import/types";
import type { JwtPrivatePayloadType } from "../../user/auth/types";
import { leads, type NewLead } from "../db";
import type {
  EmailCampaignStageValues,
  LeadSourceValues,
  LeadStatusValues,
} from "../enum";
import { EmailCampaignStage, LeadSource, LeadStatus } from "../enum";
import type {
  LeadsImportRequestOutput,
  LeadsImportResponseOutput,
} from "./definition";
import type { CsvImportJobStatus, CsvImportJobStatusValue } from "./enum";
import type { ImportJobsStatusGetResponseOutput } from "./status/definition";

/**
 * Domain Repository Interface
 * Each domain must implement this interface to handle their specific import logic
 */
export interface DomainImportRepository<T extends DomainRecord> {
  /**
   * Validate a CSV row for the specific domain
   */
  validateCsvRow(
    row: Record<string, string>,
    config: CsvImportConfig,
  ): Promise<CsvRowValidationResult> | CsvRowValidationResult;

  /**
   * Create or update a record in the domain
   */
  createOrUpdateRecord(
    data: T,
    config: CsvImportConfig,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ created: boolean; updated: boolean; duplicate: boolean }>
  >;

  /**
   * Check if a record exists by email
   */
  recordExistsByEmail(email: string, logger: EndpointLogger): Promise<boolean>;

  /**
   * Get domain name for tracking
   */
  getDomainName(): string;

  /**
   * List import jobs with formatted response
   */
  listImportJobsFormatted(
    userId: string,
    filters: {
      status?: string;
      limit?: number;
      offset?: number;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<ImportJobsStatusGetResponseOutput>>;

  /**
   * Update import job with formatted response
   */
  updateImportJobFormatted(
    userId: string,
    updates: {
      jobId: string;
      batchSize?: number;
      maxRetries?: number;
    },
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      job: {
        info: {
          id: string;
          fileName: string;
          status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
        };
        progress: {
          totalRows: number | null;
          processedRows: number;
          successfulImports: number;
          failedImports: number;
          duplicateEmails: number;
        };
        configuration: {
          currentBatchStart: number;
          batchSize: number;
          retryCount: number;
          maxRetries: number;
          error: string | null;
        };
        timestamps: {
          createdAt: string;
          updatedAt: string;
          startedAt: string | null;
          completedAt: string | null;
        };
      };
    }>
  >;

  /**
   * Delete import job with formatted response
   */
  deleteImportJobFormatted(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      result: {
        success: boolean;
        message: string;
      };
    }>
  >;
}

/**
 * Lead Record Interface
 */
interface LeadRecord extends DomainRecord {
  id?: string;
  email: string;
  businessName?: string;
  contactName?: string;
  phone?: string;
  website?: string;
  country: Countries;
  language: Languages;
  source: typeof LeadSourceValues;
  status: typeof LeadStatusValues;
  currentCampaignStage: typeof EmailCampaignStageValues;
}

/**
 * Generic CSV Import Configuration
 */
export interface CsvImportConfig {
  file: string; // Base64 encoded CSV content
  fileName: string;
  skipDuplicates: boolean;
  updateExisting: boolean;
  defaultCountry: Countries;
  defaultLanguage: Languages;
  defaultStatus: typeof LeadStatusValues;
  defaultCampaignStage: typeof EmailCampaignStageValues;
  defaultSource: typeof LeadSourceValues;
  useChunkedProcessing: boolean;
  batchSize: number;
}

/**
 * CSV Row Validation Result
 */
export interface CsvRowValidationResult {
  isValid: boolean;
  errors: ErrorResponseType[];
  data: Record<string, string | number | boolean | null>;
}

/**
 * Import Error Details
 */
export interface ImportError {
  row: number;
  email?: string;
  error: string;
}

/**
 * Import Summary Statistics
 */
export interface ImportSummary {
  newRecords: number;
  updatedRecords: number;
  skippedDuplicates: number;
}

/**
 * Import Result
 */
export interface ImportResult {
  batchId: string;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  duplicateEmails: number;
  errors: ImportError[];
  summary: ImportSummary;
  isChunkedProcessing: boolean;
  jobId?: string;
}

/**
 * CSV Import Job Status
 */
export interface CsvImportJobStatusType {
  id: string;
  fileName: string;
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
  totalRows: number | null;
  processedRows: number;
  successfulImports: number;
  failedImports: number;
  duplicateEmails: number;
  currentBatchStart: number;
  batchSize: number;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

/**
 * Leads Import Repository Interface
 */
export interface ILeadsImportRepository
  extends DomainImportRepository<LeadRecord> {
  importLeadsFromCsv(
    data: LeadsImportRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsImportResponseOutput>>;
}

/**
 * Leads Domain Import Repository
 */
export class LeadsImportRepository implements ILeadsImportRepository {
  /**
   * Get domain name for tracking
   */
  getDomainName(): string {
    return "leads";
  }

  /**
   * Validate a CSV row for leads
   */
  validateCsvRow(
    row: Record<string, string>,
    config: CsvImportConfig,
  ): CsvRowValidationResult {
    const errors: ErrorResponseType[] = [];
    const data: Record<string, string | number | boolean | null> = {};

    // Email is required
    if (row.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(row.email.trim())) {
        data.email = row.email.trim().toLowerCase();
      } else {
        errors.push(
          fail({
            message:
              "app.admin.leads.leadsErrors.leadsImport.post.error.validation.invalid_email_format",
            errorType: ErrorResponseTypes.BAD_REQUEST,
          }),
        );
      }
    } else {
      errors.push(
        fail({
          message:
            "app.admin.leads.leadsErrors.leadsImport.post.error.validation.email_required",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        }),
      );
    }

    // Optional fields with validation
    if (row.businessName || row.company) {
      data.businessName = (row.businessName || row.company || "").trim();
    }

    if (row.contactName || row.firstName || row.lastName) {
      const firstName = row.firstName || row.contactName || "";
      const lastName = row.lastName || "";
      data.contactName = `${firstName} ${lastName}`.trim() || null;
    }

    if (row.phone) {
      data.phone = row.phone.trim();
    }

    // Config has properly typed defaults from Zod validation
    data.country = config.defaultCountry;
    data.language = config.defaultLanguage;
    data.source = config.defaultSource;
    data.status = config.defaultStatus;
    data.currentCampaignStage = config.defaultCampaignStage;

    return {
      isValid: errors.length === 0,
      errors,
      data,
    };
  }

  /**
   * Create or update a lead record
   */
  async createOrUpdateRecord(
    data: LeadRecord,
    config: CsvImportConfig,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ created: boolean; updated: boolean; duplicate: boolean }>
  > {
    try {
      // Check if lead exists
      const existingLead = await db
        .select()
        .from(leads)
        .where(eq(leads.email, data.email))
        .limit(1);

      if (existingLead.length > 0) {
        if (config.skipDuplicates) {
          return success({
            created: false,
            updated: false,
            duplicate: true,
          });
        }

        if (config.updateExisting) {
          // Update existing lead
          const updateData: Partial<NewLead> = {};

          if (data.businessName) {
            updateData.businessName = data.businessName;
          }
          if (data.contactName) {
            updateData.contactName = data.contactName;
          }
          if (data.phone) {
            updateData.phone = data.phone;
          }
          if (data.website) {
            updateData.website = data.website;
          }
          if (data.country) {
            updateData.country = data.country;
          }
          if (data.language) {
            updateData.language = data.language;
          }
          if (data.status) {
            updateData.status = data.status;
          }
          if (data.currentCampaignStage) {
            updateData.currentCampaignStage = data.currentCampaignStage;
          }

          await db
            .update(leads)
            .set(updateData)
            .where(eq(leads.id, existingLead[0].id));

          logger.debug("Updated existing lead", {
            leadId: existingLead[0].id,
            email: data.email,
          });

          return success({
            created: false,
            updated: true,
            duplicate: false,
          });
        } else {
          return success({
            created: false,
            updated: false,
            duplicate: true,
          });
        }
      }

      // Create new lead
      const newLeadData: NewLead = {
        email: data.email,
        businessName: data.businessName || "",
        contactName: data.contactName || null,
        phone: data.phone || null,
        website: data.website || null,
        country: data.country,
        language: data.language,
        source: data.source,
        status: data.status,
        currentCampaignStage: data.currentCampaignStage,
      };

      const [newLead] = await db.insert(leads).values(newLeadData).returning();

      logger.debug("Created new lead", {
        leadId: newLead.id,
        email: data.email,
      });

      return success({
        created: true,
        updated: false,
        duplicate: false,
      });
    } catch (error) {
      logger.error("Error creating/updating lead", parseError(error));
      return fail({
        message:
          "app.admin.leads.leadsErrors.leadsImport.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Check if a lead exists by email
   */
  async recordExistsByEmail(
    email: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      const existingLead = await db
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.email, email))
        .limit(1);

      return existingLead.length > 0;
    } catch (error) {
      logger.error("Error checking lead existence", parseError(error));
      return false;
    }
  }

  /**
   * High-level method for importing leads from CSV
   * Uses the definition types and delegates to the generic import repository
   */
  async importLeadsFromCsv(
    data: LeadsImportRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsImportResponseOutput>> {
    try {
      // Convert the request data to the generic config format
      const config: CsvImportConfig = {
        file: data.file,
        fileName: data.fileName,
        skipDuplicates: data.skipDuplicates ?? true,
        updateExisting: data.updateExisting ?? false,
        defaultCountry: data.defaultCountry,
        defaultLanguage: data.defaultLanguage,
        defaultStatus: data.defaultStatus ?? LeadStatus.NEW,
        defaultCampaignStage:
          data.defaultCampaignStage ?? EmailCampaignStage.NOT_STARTED,
        defaultSource: data.defaultSource ?? LeadSource.CSV_IMPORT,
        useChunkedProcessing: data.useChunkedProcessing ?? false,
        batchSize: data.batchSize ?? 100,
      };

      logger.info("Starting CSV import for leads", {
        fileName: data.fileName,
        userId: user.id,
        defaultCountry: data.defaultCountry,
        defaultLanguage: data.defaultLanguage,
      });

      // Use the generic import repository with this domain-specific implementation
      const result = await importRepository.importFromCsv(
        config,
        user.id,
        this,
        logger,
      );

      // Map the generic result to the leads-specific response format
      if (result.success) {
        return success({
          batchId: result.data.batchId,
          totalRows: result.data.totalRows,
          successfulImports: result.data.successfulImports,
          failedImports: result.data.failedImports,
          duplicateEmails: result.data.duplicateEmails,
          errors: result.data.errors,
          summary: result.data.summary,
          isChunkedProcessing: result.data.isChunkedProcessing,
          jobId: result.data.jobId,
        });
      } else {
        logger.error("CSV import failed", result.message);
        return result;
      }
    } catch (error) {
      logger.error("Error importing leads from CSV", parseError(error));
      return fail({
        message:
          "app.admin.leads.leadsErrors.leadsImport.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * List import jobs with formatted response
   */
  async listImportJobsFormatted(
    userId: string,
    filters: {
      status?: typeof CsvImportJobStatusValue | "all";
      limit?: number;
      offset?: number;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<ImportJobsStatusGetResponseOutput>> {
    const response = await importRepository.listImportJobs(
      userId,
      {
        status: filters.status as typeof CsvImportJobStatusValue | undefined,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      },
      logger,
    );

    if (!response.success) {
      return response;
    }

    // Transform the response to match the expected format
    return success({
      jobs: {
        items: response.data.jobs.map((job) => ({
          id: job.id,
          fileName: job.fileName,
          status: job.status,
          totalRows: job.progress.totalRows,
          processedRows: job.progress.processedRows,
          successfulImports: job.results.successfulImports,
          failedImports: job.results.failedImports,
          duplicateEmails: job.results.duplicateEmails,
          currentBatchStart: job.progress.currentBatchStart,
          batchSize: job.progress.batchSize,
          error: job.errorInfo.error,
          retryCount: job.errorInfo.retryCount,
          maxRetries: job.errorInfo.maxRetries,
          createdAt: job.timing.createdAt,
          updatedAt: job.timing.updatedAt,
          startedAt: job.timing.startedAt,
          completedAt: job.timing.completedAt,
        })),
      },
    });
  }

  /**
   * Update import job with formatted response
   */
  async updateImportJobFormatted(
    userId: string,
    updates: {
      jobId: string;
      batchSize?: number;
      maxRetries?: number;
    },
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      job: {
        info: {
          id: string;
          fileName: string;
          status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
        };
        progress: {
          totalRows: number | null;
          processedRows: number;
          successfulImports: number;
          failedImports: number;
          duplicateEmails: number;
        };
        configuration: {
          currentBatchStart: number;
          batchSize: number;
          retryCount: number;
          maxRetries: number;
          error: string | null;
        };
        timestamps: {
          createdAt: string;
          updatedAt: string;
          startedAt: string | null;
          completedAt: string | null;
        };
      };
    }>
  > {
    const response = await importRepository.updateImportJob(
      userId,
      updates,
      logger,
    );

    if (!response.success) {
      return response;
    }

    return success({
      job: {
        info: {
          id: response.data.id,
          fileName: response.data.fileName,
          status: response.data.status,
        },
        progress: {
          totalRows: response.data.totalRows,
          processedRows: response.data.processedRows,
          successfulImports: response.data.successfulImports,
          failedImports: response.data.failedImports,
          duplicateEmails: response.data.duplicateEmails,
        },
        configuration: {
          currentBatchStart: response.data.currentBatchStart,
          batchSize: response.data.batchSize,
          retryCount: response.data.retryCount,
          maxRetries: response.data.maxRetries,
          error: response.data.error || null,
        },
        timestamps: {
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          startedAt: response.data.startedAt,
          completedAt: response.data.completedAt,
        },
      },
    });
  }

  /**
   * Delete import job with formatted response
   */
  async deleteImportJobFormatted(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      result: {
        success: boolean;
        message: string;
      };
    }>
  > {
    const response = await importRepository.deleteImportJob(
      userId,
      jobId,
      logger,
    );

    if (!response.success) {
      return response;
    }

    return success({
      result: response.data,
    });
  }
}

/**
 * Singleton instance
 */
export const leadsImportRepository = new LeadsImportRepository();
