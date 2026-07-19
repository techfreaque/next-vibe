/**
 * POS Terminal List Repository
 * Lists terminals for a company (or all companies the user is a member of)
 */

import { and, eq, inArray } from "drizzle-orm";
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

import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { posTerminals } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { PosTerminalListGetRequestOutput } from "./definition";

export class PosTerminalListRepository {
  static async listTerminals(
    data: PosTerminalListGetRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      terminals: {
        id: string;
        name: string;
        location: string | null;
        currency: string;
        isActive: boolean;
        createdAt: Date;
      }[];
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      if (!data.companyId) {
        // No companyId provided — return terminals for ALL companies user belongs to
        const memberCompanies = await db
          .select({ companyId: companyMembers.companyId })
          .from(companyMembers)
          .where(
            and(
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
            ),
          );

        const companyIds = memberCompanies.map((m) => m.companyId);

        if (companyIds.length === 0) {
          return success({ terminals: [] });
        }

        const terminals = await db
          .select({
            id: posTerminals.id,
            name: posTerminals.name,
            location: posTerminals.location,
            currency: posTerminals.currency,
            isActive: posTerminals.isActive,
            createdAt: posTerminals.createdAt,
          })
          .from(posTerminals)
          .where(inArray(posTerminals.companyId, companyIds));

        return success({ terminals });
      }

      // Verify VIEWER+ company membership for the specific company
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const terminals = await db
        .select({
          id: posTerminals.id,
          name: posTerminals.name,
          location: posTerminals.location,
          currency: posTerminals.currency,
          isActive: posTerminals.isActive,
          createdAt: posTerminals.createdAt,
        })
        .from(posTerminals)
        .where(eq(posTerminals.companyId, data.companyId));

      return success({ terminals });
    } catch (error) {
      logger.error("Error listing POS terminals", parseError(error));
      return fail({
        message: t("terminalList.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
