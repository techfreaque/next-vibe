/**
 * POS Session Get Repository
 * Retrieves session details by ID
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

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
