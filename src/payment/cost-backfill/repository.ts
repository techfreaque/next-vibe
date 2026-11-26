import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import type definition from "./definition";
import { type HistoryRow, parseCostHistory } from "./history";
import type { scopedTranslation } from "./i18n";

function reviewStatus(
  row: HistoryRow,
): "commitment" | "missing" | "verifyPaid" | "ready" {
  if (row.evidence === "commitment") {
    return "commitment";
  }
  if (!row.date || !row.gross || !row.currency || !row.tax || !row.invoice) {
    return "missing";
  }
  return row.evidence === "paid" ? "verifyPaid" : "ready";
}

export async function reviewCostHistory(
  companyId: string,
  history: string,
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<ResponseType<(typeof definition.POST)["types"]["ResponseOutput"]>> {
  const access = await CompanyAuthRepository.requireMember(
    userId,
    companyId,
    CompanyMemberRole.ACCOUNTANT,
    logger,
    locale,
  );
  if (!access.success) {
    return fail({
      message: t("forbidden"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  const rows = parseCostHistory(history);
  if (!rows) {
    return fail({
      message: t("failure"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
  return success({
    company: companyId,
    rows: rows.map((row) => ({ ...row, status: reviewStatus(row) })),
  });
}
