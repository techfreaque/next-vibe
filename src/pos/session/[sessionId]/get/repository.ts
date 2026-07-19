/**
 * POS Session Get Repository
 * Retrieves session details by ID
 */

import { eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { posSessions, posTerminals } from "../../../db";
import { scopedTranslation } from "../../../i18n";
export class PosSessionGetRepository {
  static async getSession(
    sessionId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        terminalId: string;
        cashierUserId: string;
        status: string;
        openedAt: Date;
        closedAt: Date | null;
        openingFloat: number;
        closingFloat: number | null;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [session] = await db
        .select({
          id: posSessions.id,
          terminalId: posSessions.terminalId,
          cashierUserId: posSessions.cashierUserId,
          status: posSessions.status,
          openedAt: posSessions.openedAt,
          closedAt: posSessions.closedAt,
          openingFloat: posSessions.openingFloat,
          closingFloat: posSessions.closingFloat,
        })
        .from(posSessions)
        .where(eq(posSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("sessionGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify user is a member of the terminal's company
      const [terminal] = await db
        .select({ companyId: posTerminals.companyId })
        .from(posTerminals)
        .where(eq(posTerminals.id, session.terminalId))
        .limit(1);

      if (terminal) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          terminal.companyId,
          CompanyMemberRole.MEMBER,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      }

      return success({ result: session });
    } catch (error) {
      logger.error("Error getting POS session", parseError(error));
      return fail({
        message: t("sessionGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
