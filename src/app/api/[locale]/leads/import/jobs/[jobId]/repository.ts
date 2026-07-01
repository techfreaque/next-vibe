import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { csvImportJobs } from "../../db";
import { CsvImportJobStatus as CsvImportJobStatusEnum } from "../../enum";
import { scopedTranslation } from "../../i18n";

export class LeadsImportJobRepository {
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
}
