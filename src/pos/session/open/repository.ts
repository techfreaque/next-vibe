/**
 * POS Session Open Repository
 * Opens a new cashier session on a terminal
 */

import { and, eq } from "drizzle-orm";
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

import { posSessions, posTerminals } from "../../db";
import { PosSessionStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import type { PosSessionOpenPostRequestOutput } from "./definition";

export class PosSessionOpenRepository {
  static async openSession(
    data: PosSessionOpenPostRequestOutput,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        terminalId: string;
        openedAt: Date;
        status: string;
        openingFloat: number;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      // Verify terminal exists and load companyId for auth
      const [terminal] = await db
        .select({ id: posTerminals.id, companyId: posTerminals.companyId })
        .from(posTerminals)
        .where(eq(posTerminals.id, details.terminalId))
        .limit(1);

      if (!terminal) {
        return fail({
          message: t("sessionOpen.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify user is a member of the terminal's company
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

      // Check for existing open session
      const [existingOpen] = await db
        .select({ id: posSessions.id })
        .from(posSessions)
        .where(
          and(
            eq(posSessions.terminalId, details.terminalId),
            eq(posSessions.status, PosSessionStatus.OPEN),
          ),
        )
        .limit(1);

      if (existingOpen) {
        return fail({
          message: t("sessionOpen.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [session] = await db
        .insert(posSessions)
        .values({
          terminalId: details.terminalId,
          cashierUserId: userId,
          openingFloat: details.openingFloat ?? 0,
          status: PosSessionStatus.OPEN,
        })
        .returning({
          id: posSessions.id,
          terminalId: posSessions.terminalId,
          openedAt: posSessions.openedAt,
          status: posSessions.status,
          openingFloat: posSessions.openingFloat,
        });

      if (!session) {
        logger.error("Failed to insert POS session");
        return fail({
          message: t("sessionOpen.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: session });
    } catch (error) {
      logger.error("Error opening POS session", parseError(error));
      return fail({
        message: t("sessionOpen.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
