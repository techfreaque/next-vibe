/**
 * Daily Status Report Repository
 * Collects platform data (defensively), composes the plain-text report and
 * sends it through the system mailbox.
 */

import "server-only";

import { sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { isValidRecipient } from "../compose";
import type { SystemMailboxT } from "../i18n";
import { SystemMailboxRepository } from "../repository";
import type { ReportQueryRunner, ReportRow } from "./composer";
import { collectReportData, composeReport } from "./composer";
import type {
  SystemMailReportRequestOutput,
  SystemMailReportResponseOutput,
} from "./definition";

const REPORT_WINDOW_HOURS = 24;
const REPORT_INSTANCE = "unbottled";

/** Production query runner over the shared Drizzle connection. */
export const dbReportQueryRunner: ReportQueryRunner = {
  tableExists: async (table) => {
    const result = await db.execute(
      sql`SELECT to_regclass(${`public.${table}`}) AS name`,
    );
    const row = result.rows[0] as { name: string | null } | undefined;
    return Boolean(row?.name);
  },
  rows: async (query, since) => {
    const result = await db.execute(
      sql.raw(query.replaceAll("{{since}}", since.toISOString())),
    );
    return result.rows.map((row): ReportRow => {
      const out: ReportRow = {};
      for (const [key, value] of Object.entries(row)) {
        out[key] =
          typeof value === "number" || typeof value === "string"
            ? value
            : value === null || value === undefined
              ? null
              : String(value);
      }
      return out;
    });
  },
};

export class SystemMailReportRepository {
  /** Replaceable in tests. */
  static runner: ReportQueryRunner = dbReportQueryRunner;

  static async run(
    data: SystemMailReportRequestOutput,
    userId: string | undefined,
    logger: EndpointLogger,
    t: SystemMailboxT,
  ): Promise<ResponseType<SystemMailReportResponseOutput>> {
    try {
      const reportData = await collectReportData(
        SystemMailReportRepository.runner,
        {
          now: new Date(),
          windowHours: REPORT_WINDOW_HOURS,
          instance: REPORT_INSTANCE,
        },
      );
      const report = composeReport(reportData);
      const base = {
        subject: report.subject,
        body: report.body,
        sections: report.sectionKeys.join(", "),
        skippedSections: report.skippedKeys.join(", "),
      };

      const recipient =
        data.to?.trim() || SystemMailboxRepository.getDefaultReportRecipient();

      if (data.dryRun) {
        return success({ ...base, recipient, sent: false });
      }
      if (!recipient) {
        return fail({
          message: t("errors.noRecipient"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (!isValidRecipient(recipient)) {
        return fail({
          message: t("errors.invalidRecipient"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const sendResult = await SystemMailboxRepository.send(
        { to: recipient, subject: report.subject, text: report.body },
        userId,
        logger,
        t,
      );
      if (!sendResult.success) {
        return sendResult;
      }
      return success({ ...base, recipient, sent: true });
    } catch (error) {
      logger.error("Daily status report failed", parseError(error));
      return fail({
        message: t("errors.reportFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
