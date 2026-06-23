/**
 * POS Terminal Create Repository
 * Creates a new POS terminal for a company
 */

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

import { posTerminals } from "../../db";
import { scopedTranslation } from "../../i18n";
import type { PosTerminalCreatePostRequestOutput } from "./definition";

export class PosTerminalCreateRepository {
  static async createTerminal(
    data: PosTerminalCreatePostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        name: string;
        companyId: string;
        currency: string;
        isActive: boolean;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { details } = data;

      // Verify ADMIN+ company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        details.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const [terminal] = await db
        .insert(posTerminals)
        .values({
          companyId: details.companyId,
          name: details.name,
          location: details.location,
          currency: details.currency ?? "EUR",
          cashAccountNodeId: details.cashAccountNodeId,
        })
        .returning({
          id: posTerminals.id,
          name: posTerminals.name,
          companyId: posTerminals.companyId,
          currency: posTerminals.currency,
          isActive: posTerminals.isActive,
        });

      if (!terminal) {
        logger.error("Failed to insert POS terminal");
        return fail({
          message: t("terminalCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: terminal });
    } catch (error) {
      logger.error("Error creating POS terminal", parseError(error));
      return fail({
        message: t("terminalCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
