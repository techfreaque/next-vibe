/**
 * POS Terminal List Repository
 * Lists terminals for a company (or all companies the user is a member of),
 * each with the id of its open session so callers can jump straight to the till.
 */

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "@/companies/db";
import { getDocumentCompanies } from "@/finance/document-company-scope";

import { posSessions, posTerminals } from "../../db";
import { PosSessionStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type {
  PosTerminalListGetRequestOutput,
  PosTerminalListGetResponseOutput,
} from "./definition";

export class PosTerminalListRepository {
  static async listTerminals(
    data: PosTerminalListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosTerminalListGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Active memberships only; a named company the user is not in yields none.
      const memberCompanies = await getDocumentCompanies(
        userId,
        data.companyId,
      );
      if (data.companyId && memberCompanies.length === 0) {
        return fail({
          message: t("terminalList.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const companyIds = memberCompanies.map((company) => company.id);
      if (companyIds.length === 0) {
        return success({ terminals: [] });
      }

      const rows = await db
        .select({
          id: posTerminals.id,
          name: posTerminals.name,
          location: posTerminals.location,
          currency: posTerminals.currency,
          isActive: posTerminals.isActive,
          companyName: companies.name,
          createdAt: posTerminals.createdAt,
        })
        .from(posTerminals)
        .innerJoin(companies, eq(companies.id, posTerminals.companyId))
        .where(
          and(
            inArray(posTerminals.companyId, companyIds),
            data.terminalId ? eq(posTerminals.id, data.terminalId) : undefined,
          ),
        )
        // Working tills first, then by name.
        .orderBy(desc(posTerminals.isActive), asc(posTerminals.name));

      const terminalIds = rows.map((row) => row.id);
      const openSessions =
        terminalIds.length === 0
          ? []
          : await db
              .select({
                id: posSessions.id,
                terminalId: posSessions.terminalId,
              })
              .from(posSessions)
              .where(
                and(
                  inArray(posSessions.terminalId, terminalIds),
                  eq(posSessions.status, PosSessionStatus.OPEN),
                ),
              );
      const openByTerminal = new Map(
        openSessions.map((session) => [session.terminalId, session.id]),
      );

      return success({
        terminals: rows.map((row) => ({
          ...row,
          openSessionId: openByTerminal.get(row.id) ?? null,
        })),
      });
    } catch (error) {
      logger.error("Error listing POS terminals", parseError(error));
      return fail({
        message: t("terminalList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
