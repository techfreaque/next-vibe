import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getDocumentCompanies } from "@/finance/document-company-scope";

import type { PostingReviewRequest, PostingReviewResponse } from "./definition";
import { scopedTranslation } from "./i18n";
import { buildPostingReviewQuery, type ReviewQueryRow } from "./query";

const zeroCounts = {
  missingLines: 0,
  invalidLegs: 0,
  invoiceLinks: 0,
  billLinks: 0,
};

export class PostingReviewRepository {
  static async review(
    data: PostingReviewRequest,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PostingReviewResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const companies = await getDocumentCompanies(userId, data.companyId);
      const company = companies.length === 1 ? companies[0] : undefined;
      if (!company) {
        if (data.companyId) {
          return fail({
            message: t("errors.forbidden.description"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        return success({
          reportCompanyId: null,
          reportCompanyName: null,
          filterKind: data.kind ?? null,
          currentPage: data.page,
          matchedCount: 0,
          totalPages: 0,
          counts: zeroCounts,
          rows: [],
        });
      }

      const { rows } = await db.execute<ReviewQueryRow>(
        buildPostingReviewQuery({ ...data, companyId: company.id }),
      );
      const summary = rows[0];
      const matchedCount = summary?.matches ?? 0;

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        filterKind: data.kind ?? null,
        currentPage: data.page,
        matchedCount,
        totalPages: Math.ceil(matchedCount / data.pageSize),
        counts: {
          missingLines: summary?.missing_lines ?? 0,
          invalidLegs: summary?.invalid_legs ?? 0,
          invoiceLinks: summary?.invoice_links ?? 0,
          billLinks: summary?.bill_links ?? 0,
        },
        rows: rows.flatMap((row) =>
          row.kind && row.reason && row.entity_id && row.record_day
            ? [
                {
                  kind: row.kind,
                  reason: row.reason,
                  entityId: row.entity_id,
                  reference: row.reference,
                  counterparty: row.counterparty,
                  recordDate: row.record_day,
                },
              ]
            : [],
        ),
      });
    } catch (error) {
      logger.error("Could not load posting review", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
