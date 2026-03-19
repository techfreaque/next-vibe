/**
 * Leads Import Repository
 * Handles CSV import operations for leads domain
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
  TaskOutputMode,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";

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
import { csvImportJobs, importBatches, type CsvImportJob } from "./db";
import type { CsvImportJobStatus, CsvImportJobStatusValue } from "./enum";
import { CsvImportJobStatus as CsvImportJobStatusEnum } from "./enum";
import type { ImportT } from "./i18n";
import { scopedTranslation } from "./i18n";
import type { ImportJobsStatusGetResponseOutput } from "./status/definition";

interface CsvImportConfig {
  file: string;
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

interface CsvRowValidationResult {
  isValid: boolean;
  errors: ErrorResponseType[];
  data?: Record<string, string | number | boolean | null>;
}

interface LeadRecord {
  email: string;
  businessName?: string;
  contactName?: string | null;
  phone?: string | null;
  website?: string | null;
  country: Countries;
  language: Languages;
  source: typeof LeadSourceValues;
  status: typeof LeadStatusValues;
  currentCampaignStage: typeof EmailCampaignStageValues;
}

/**
 * Import Repository (alias for LeadsImportRepository)
 * Provides generic import operations used by route handlers
 */
export class LeadsImportRepository {
  /**
   * Validate a CSV row for leads
   */
  static validateCsvRow(
    row: Record<string, string>,
    config: CsvImportConfig,
  ): CsvRowValidationResult {
    const errors: ErrorResponseType[] = [];
    const data: Record<string, string | number | boolean | null> = {};
    const locale = getLocaleFromLanguageAndCountry(
      config.defaultLanguage,
      config.defaultCountry,
    );
    const t = scopedTranslation.scopedT(locale).t;

    // Email is required
    if (row.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(row.email.trim())) {
        data.email = row.email.trim().toLowerCase();
      } else {
        errors.push(
          fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          }),
        );
      }
    } else {
      errors.push(
        fail({
          message: t("post.errors.validation.title"),
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
    data.source = config.defaultSource ?? null;
    data.status = config.defaultStatus ?? null;
    data.currentCampaignStage = config.defaultCampaignStage ?? null;

    return {
      isValid: errors.length === 0,
      errors,
      data,
    };
  }

  /**
   * Create or update a lead record
   */
  static async createOrUpdateRecord(
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
        }
        return success({
          created: false,
          updated: false,
          duplicate: true,
        });
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
      const locale = getLocaleFromLanguageAndCountry(
        config.defaultLanguage,
        config.defaultCountry,
      );
      const t = scopedTranslation.scopedT(locale).t;
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Check if a lead exists by email
   */
  static async recordExistsByEmail(
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
   */
  static async importLeadsFromCsv(
    data: LeadsImportRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: ImportT,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadsImportResponseOutput>> {
    try {
      const config: CsvImportConfig = {
        file: data.file,
        fileName: data.fileName ?? "import.csv",
        skipDuplicates: data.skipDuplicates ?? true,
        updateExisting: data.updateExisting ?? false,
        defaultCountry: data.defaultCountry,
        defaultLanguage: data.defaultLanguage,
        defaultStatus: data.defaultStatus ?? LeadStatus.NEW,
        defaultCampaignStage:
          data.defaultCampaignStage ?? EmailCampaignStage.NOT_STARTED,
        defaultSource: data.defaultSource ?? LeadSource.CSV_IMPORT,
        useChunkedProcessing: data.useChunkedProcessing ?? true,
        batchSize: data.batchSize ?? 100,
      };

      logger.info("Starting CSV import for leads", {
        fileName: data.fileName,
        userId: user.id,
        defaultCountry: data.defaultCountry,
        defaultLanguage: data.defaultLanguage,
      });

      const result = await LeadsImportRepository.importFromCsv(
        config,
        user.id,
        logger,
        t,
      );

      if (result.success) {
        // Create a one-shot cron task to process this import job
        if (result.data.isChunkedProcessing && result.data.jobId) {
          const taskId = `leads-import-${result.data.jobId}`;
          await db
            .insert(cronTasks)
            .values({
              id: taskId,
              shortId: taskId,
              routeId: "leads_import_process_POST",
              displayName: `Process import job ${result.data.jobId}`,
              category: TaskCategory.MAINTENANCE,
              schedule: "* * * * *",
              priority: CronTaskPriority.MEDIUM,
              enabled: true,
              runOnce: true,
              taskInput: {
                dryRun: false,
                maxJobsPerRun: 1,
                maxRetriesPerJob: 0,
                selfTaskId: taskId,
              },
              outputMode: TaskOutputMode.STORE_ONLY,
              notificationTargets: [],
              tags: ["leads-import", result.data.jobId],
            })
            .onConflictDoNothing();

          logger.info("Created one-shot import task", {
            taskId,
            userId: user.id,
            jobId: result.data.jobId,
            fileName: data.fileName,
          });
        }

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
      }
      logger.error("CSV import failed", result.message);
      return result;
    } catch (error) {
      logger.error("Error importing leads from CSV", parseError(error));
      const errT = scopedTranslation.scopedT(locale).t;
      return fail({
        message: errT("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * List import jobs with formatted response
   */
  static async listImportJobsFormatted(
    userId: string,
    filters: {
      status?: typeof CsvImportJobStatusValue | undefined;
      limit?: number;
      offset?: number;
    },
    logger: EndpointLogger,
    t: ImportT,
  ): Promise<ResponseType<ImportJobsStatusGetResponseOutput>> {
    try {
      const conditions = [eq(csvImportJobs.uploadedBy, userId)];
      if (filters.status) {
        conditions.push(eq(csvImportJobs.status, filters.status));
      }

      const jobs = await db
        .select()
        .from(csvImportJobs)
        .where(and(...conditions))
        .limit(filters.limit ?? 50)
        .offset(filters.offset ?? 0)
        .orderBy(sql`${csvImportJobs.createdAt} DESC`);

      return success({
        jobs: {
          items: jobs.map((job) => ({
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
            error: job.error ?? null,
            retryCount: job.retryCount,
            maxRetries: job.maxRetries,
            createdAt: job.createdAt.toISOString(),
            updatedAt: job.updatedAt.toISOString(),
            startedAt: job.startedAt?.toISOString() ?? null,
            completedAt: job.completedAt?.toISOString() ?? null,
          })),
        },
      });
    } catch (error) {
      logger.error("Error listing import jobs", parseError(error));
      return fail({
        message: t("errors.status.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update import job with formatted response
   */
  static async updateImportJobFormatted(
    userId: string,
    updates: {
      jobId: string;
      batchSize?: number;
      maxRetries?: number;
    },
    logger: EndpointLogger,
    locale: CountryLanguage,
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
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [existing] = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, updates.jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message: t("errors.status.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updateData: Partial<CsvImportJob> = {
        updatedAt: new Date(),
      };
      if (updates.batchSize !== undefined) {
        updateData.batchSize = updates.batchSize;
      }
      if (updates.maxRetries !== undefined) {
        updateData.maxRetries = updates.maxRetries;
      }

      const [updated] = await db
        .update(csvImportJobs)
        .set(updateData)
        .where(eq(csvImportJobs.id, updates.jobId))
        .returning();

      if (!updated) {
        return fail({
          message: t("errors.status.server"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        job: {
          info: {
            id: updated.id,
            fileName: updated.fileName,
            status: updated.status,
          },
          progress: {
            totalRows: updated.totalRows,
            processedRows: updated.processedRows,
            successfulImports: updated.successfulImports,
            failedImports: updated.failedImports,
            duplicateEmails: updated.duplicateEmails,
          },
          configuration: {
            currentBatchStart: updated.currentBatchStart,
            batchSize: updated.batchSize,
            retryCount: updated.retryCount,
            maxRetries: updated.maxRetries,
            error: updated.error ?? null,
          },
          timestamps: {
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            startedAt: updated.startedAt?.toISOString() ?? null,
            completedAt: updated.completedAt?.toISOString() ?? null,
          },
        },
      });
    } catch (error) {
      logger.error("Error updating import job", parseError(error));
      return fail({
        message: t("errors.status.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get import job by ID with formatted response
   */
  static async getImportJobFormatted(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
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
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [job] = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!job) {
        return fail({
          message: t("errors.status.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        job: {
          info: {
            id: job.id,
            fileName: job.fileName,
            status: job.status,
          },
          progress: {
            totalRows: job.totalRows,
            processedRows: job.processedRows,
            successfulImports: job.successfulImports,
            failedImports: job.failedImports,
            duplicateEmails: job.duplicateEmails,
          },
          configuration: {
            currentBatchStart: job.currentBatchStart,
            batchSize: job.batchSize,
            retryCount: job.retryCount,
            maxRetries: job.maxRetries,
            error: job.error ?? null,
          },
          timestamps: {
            createdAt: job.createdAt.toISOString(),
            updatedAt: job.updatedAt.toISOString(),
            startedAt: job.startedAt?.toISOString() ?? null,
            completedAt: job.completedAt?.toISOString() ?? null,
          },
        },
      });
    } catch (error) {
      logger.error("Error getting import job", parseError(error));
      return fail({
        message: t("errors.status.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete import job with formatted response
   */
  static async deleteImportJobFormatted(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      result: {
        success: boolean;
        message: string;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [existing] = await db
        .select({ id: csvImportJobs.id })
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message: t("errors.delete.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await db.delete(csvImportJobs).where(eq(csvImportJobs.id, jobId));

      logger.info("Deleted import job", { jobId, userId });

      return success({
        result: {
          success: true,
          message: t("errors.delete.server"),
        },
      });
    } catch (error) {
      logger.error("Error deleting import job", parseError(error));
      return fail({
        message: t("errors.delete.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Retry a failed import job — resets status to pending
   */
  static async retryJob(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ result: { success: boolean; message: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [existing] = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message: t("errors.retry.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await db
        .update(csvImportJobs)
        .set({
          status: CsvImportJobStatusEnum.PENDING,
          error: null,
          retryCount: existing.retryCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      logger.info("Retried import job", { jobId, userId });

      return success({
        result: {
          success: true,
          message: t("errors.retry.server"),
        },
      });
    } catch (error) {
      logger.error("Error retrying import job", parseError(error));
      return fail({
        message: t("errors.retry.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Stop a running import job — sets status to cancelled
   */
  static async stopJob(
    userId: string,
    jobId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ result: { success: boolean; message: string } }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [existing] = await db
        .select()
        .from(csvImportJobs)
        .where(
          and(
            eq(csvImportJobs.id, jobId),
            eq(csvImportJobs.uploadedBy, userId),
          ),
        )
        .limit(1);

      if (!existing) {
        return fail({
          message: t("errors.cancel.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await db
        .update(csvImportJobs)
        .set({
          status: CsvImportJobStatusEnum.FAILED,
          error: "Job stopped by user",
          updatedAt: new Date(),
          completedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      logger.info("Stopped import job", { jobId, userId });

      return success({
        result: {
          success: true,
          message: t("errors.cancel.server"),
        },
      });
    } catch (error) {
      logger.error("Error stopping import job", parseError(error));
      return fail({
        message: t("errors.cancel.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Process one batch of a chunked import job
   */
  static async processBatch(
    jobId: string,
    domainRepository: typeof LeadsImportRepository,
    logger: EndpointLogger,
    t: ImportT,
  ): Promise<ResponseType<{ processed: number }>> {
    try {
      const [job] = await db
        .select()
        .from(csvImportJobs)
        .where(eq(csvImportJobs.id, jobId))
        .limit(1);

      if (!job) {
        return fail({
          message: t("errors.status.server"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Mark as processing
      await db
        .update(csvImportJobs)
        .set({
          status: CsvImportJobStatusEnum.PROCESSING,
          startedAt: job.startedAt ?? new Date(),
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      // Decode CSV content
      const csvContent = Buffer.from(job.fileContent, "base64").toString(
        "utf-8",
      );
      const lines = csvContent.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        await db
          .update(csvImportJobs)
          .set({
            status: CsvImportJobStatusEnum.COMPLETED,
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(csvImportJobs.id, jobId));
        return success({ processed: 0 });
      }

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const batchEnd = Math.min(
        job.currentBatchStart + job.batchSize,
        lines.length - 1,
      );
      const batchLines = lines.slice(job.currentBatchStart + 1, batchEnd + 1);

      const config: CsvImportConfig = {
        file: job.fileContent,
        fileName: job.fileName,
        skipDuplicates: job.skipDuplicates,
        updateExisting: job.updateExisting,
        defaultCountry: job.defaultCountry as Countries,
        defaultLanguage: job.defaultLanguage as Languages,
        defaultStatus: job.defaultStatus as typeof LeadStatusValues,
        defaultCampaignStage:
          job.defaultCampaignStage as typeof EmailCampaignStageValues,
        defaultSource: job.defaultSource as typeof LeadSourceValues,
        useChunkedProcessing: true,
        batchSize: job.batchSize,
      };

      let successCount = 0;
      let failCount = 0;
      let dupCount = 0;

      for (const line of batchLines) {
        if (!line.trim()) {
          continue;
        }
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] ?? "";
        });

        const validation = domainRepository.validateCsvRow(row, config);
        if (!validation.isValid || !validation.data) {
          failCount++;
          continue;
        }

        const record: LeadRecord = {
          email: String(validation.data.email ?? ""),
          businessName: validation.data.businessName
            ? String(validation.data.businessName)
            : undefined,
          contactName: validation.data.contactName
            ? String(validation.data.contactName)
            : null,
          phone: validation.data.phone ? String(validation.data.phone) : null,
          website: null,
          country: config.defaultCountry,
          language: config.defaultLanguage,
          source: config.defaultSource,
          status: config.defaultStatus,
          currentCampaignStage: config.defaultCampaignStage,
        };

        const result = await domainRepository.createOrUpdateRecord(
          record,
          config,
          logger,
        );
        if (result.success) {
          if (result.data.created || result.data.updated) {
            successCount++;
          } else {
            dupCount++;
          }
        } else {
          failCount++;
        }
      }

      const newBatchStart = batchEnd;
      const isComplete = newBatchStart >= lines.length - 1;

      await db
        .update(csvImportJobs)
        .set({
          currentBatchStart: newBatchStart,
          processedRows: job.processedRows + batchLines.length,
          successfulImports: job.successfulImports + successCount,
          failedImports: job.failedImports + failCount,
          duplicateEmails: job.duplicateEmails + dupCount,
          status: isComplete
            ? CsvImportJobStatusEnum.COMPLETED
            : CsvImportJobStatusEnum.PENDING,
          completedAt: isComplete ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(csvImportJobs.id, jobId));

      logger.info("Processed batch", {
        jobId,
        successCount,
        failCount,
        dupCount,
        isComplete,
      });

      return success({ processed: batchLines.length });
    } catch (error) {
      logger.error("Error processing batch", parseError(error));
      return fail({
        message: t("errors.status.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generic CSV import handler — creates batch record or chunked job
   */
  private static async importFromCsv(
    config: CsvImportConfig,
    userId: string,
    logger: EndpointLogger,
    t: ImportT,
  ): Promise<
    ResponseType<{
      batchId: string;
      totalRows: number;
      successfulImports: number;
      failedImports: number;
      duplicateEmails: number;
      errors: { row: number; email?: string; error: string }[];
      summary: {
        newLeads: number;
        updatedLeads: number;
        skippedDuplicates: number;
      };
      isChunkedProcessing: boolean;
      jobId: string | undefined;
    }>
  > {
    try {
      const csvContent = Buffer.from(config.file, "base64").toString("utf-8");
      const lines = csvContent.split("\n").filter((line) => line.trim());
      const totalRows = Math.max(0, lines.length - 1); // subtract header

      if (config.useChunkedProcessing && totalRows > 0) {
        // Store job for background processing
        const [job] = await db
          .insert(csvImportJobs)
          .values({
            fileName: config.fileName,
            fileContent: config.file,
            uploadedBy: userId,
            skipDuplicates: config.skipDuplicates,
            updateExisting: config.updateExisting,
            defaultCountry: config.defaultCountry,
            defaultLanguage: config.defaultLanguage,
            defaultStatus: config.defaultStatus,
            defaultCampaignStage: config.defaultCampaignStage,
            defaultSource: config.defaultSource,
            status: CsvImportJobStatusEnum.PENDING,
            totalRows,
            batchSize: config.batchSize,
            domain: "leads",
          })
          .returning();

        if (!job) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        const [batch] = await db
          .insert(importBatches)
          .values({
            fileName: config.fileName,
            uploadedBy: userId,
            totalRows,
            domain: "leads",
          })
          .returning();

        return success({
          batchId: batch?.id ?? job.id,
          totalRows,
          successfulImports: 0,
          failedImports: 0,
          duplicateEmails: 0,
          errors: [] as { row: number; email?: string; error: string }[],
          summary: { newLeads: 0, updatedLeads: 0, skippedDuplicates: 0 },
          isChunkedProcessing: true,
          jobId: job.id,
        });
      }

      // Immediate processing
      if (lines.length < 2) {
        return success({
          batchId: "",
          totalRows: 0,
          successfulImports: 0,
          failedImports: 0,
          duplicateEmails: 0,
          errors: [{ row: 0, error: "Empty CSV file" }],
          summary: { newLeads: 0, updatedLeads: 0, skippedDuplicates: 0 },
          isChunkedProcessing: false,
          jobId: undefined,
        });
      }

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      let successCount = 0;
      let failCount = 0;
      let dupCount = 0;
      const errors: { row: number; email?: string; error: string }[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) {
          continue;
        }
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] ?? "";
        });

        const validation = LeadsImportRepository.validateCsvRow(row, config);
        if (!validation.isValid || !validation.data) {
          failCount++;
          errors.push({ row: i + 1, error: "validation failed" });
          continue;
        }

        const record: LeadRecord = {
          email: String(validation.data.email ?? ""),
          businessName: validation.data.businessName
            ? String(validation.data.businessName)
            : undefined,
          contactName: validation.data.contactName
            ? String(validation.data.contactName)
            : null,
          phone: validation.data.phone ? String(validation.data.phone) : null,
          website: null,
          country: config.defaultCountry,
          language: config.defaultLanguage,
          source: config.defaultSource,
          status: config.defaultStatus,
          currentCampaignStage: config.defaultCampaignStage,
        };

        const result = await LeadsImportRepository.createOrUpdateRecord(
          record,
          config,
          logger,
        );
        if (result.success) {
          if (result.data.created) {
            successCount++;
          } else if (result.data.updated) {
            successCount++;
          } else {
            dupCount++;
          }
        } else {
          failCount++;
          errors.push({ row: i + 1, email: row.email, error: result.message });
        }
      }

      const [batch] = await db
        .insert(importBatches)
        .values({
          fileName: config.fileName,
          uploadedBy: userId,
          totalRows,
          successfulImports: successCount,
          failedImports: failCount,
          duplicateEmails: dupCount,
          importErrors: errors.map((e) => e.error),
          importSummary: {
            successCount,
            failCount,
            dupCount,
          },
          domain: "leads",
        })
        .returning();

      return success({
        batchId: batch?.id ?? "",
        totalRows,
        successfulImports: successCount,
        failedImports: failCount,
        duplicateEmails: dupCount,
        errors,
        summary: {
          newLeads: successCount,
          updatedLeads: 0,
          skippedDuplicates: dupCount,
        },
        isChunkedProcessing: false,
        jobId: undefined,
      });
    } catch (error) {
      logger.error("Error in importFromCsv", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Export alias for backward-compatibility with route files
export { LeadsImportRepository as ImportRepository };
