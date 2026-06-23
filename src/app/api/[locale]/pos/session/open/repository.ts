/**
 * POS Session Open Repository
 * Opens a new cashier session on a terminal
 */

import { and, eq } from "drizzle-orm";
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
