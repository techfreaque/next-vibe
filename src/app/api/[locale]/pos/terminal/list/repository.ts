/**
 * POS Terminal List Repository
 * Lists terminals for a company (or all companies the user is a member of)
 */

import { and, eq, inArray } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { companyMembers } from "@/app/api/[locale]/companies/db";
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
