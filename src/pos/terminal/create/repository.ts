/**
 * POS Terminal Create Repository
 * Creates a new POS terminal for a company
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

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { warehouses } from "@/inventory/db";

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
        warehouseName?: string;
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

      return await db.transaction(async (tx) => {
        const [warehouse] = details.warehouseId
          ? await tx
              .select({ name: warehouses.name })
              .from(warehouses)
              .where(
                and(
                  eq(warehouses.id, details.warehouseId),
                  eq(warehouses.companyId, details.companyId),
                  eq(warehouses.isActive, true),
                ),
              )
              .for("share")
          : [];
        if (details.warehouseId && !warehouse) {
          return fail({
            message: t("workflow.warehouseInstruction"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // The drawer account must be a postable cash or bank account of this company.
        const [cashAccount] = details.cashAccountNodeId
          ? await tx
              .select({ id: accountNodes.id })
              .from(accountNodes)
              .where(
                and(
                  eq(accountNodes.id, details.cashAccountNodeId),
                  eq(accountNodes.companyId, details.companyId),
                  eq(accountNodes.isPostable, true),
                  eq(accountNodes.isActive, true),
                  inArray(accountNodes.subtype, [
                    AccountSubtype.CASH,
                    AccountSubtype.BANK,
                  ]),
                ),
              )
              .limit(1)
          : [];
        if (details.cashAccountNodeId && !cashAccount) {
          return fail({
            message: t("terminalCreate.post.cashAccountNodeId.invalid"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        // No currency chosen: sell in the company currency.
        const [company] = details.currency
          ? []
          : await tx
              .select({ currency: companies.currency })
              .from(companies)
              .where(eq(companies.id, details.companyId))
              .limit(1);

        const [terminal] = await tx
          .insert(posTerminals)
          .values({
            companyId: details.companyId,
            name: details.name,
            location: details.location,
            currency: (
              details.currency ??
              company?.currency ??
              "EUR"
            ).toUpperCase(),
            cashAccountNodeId: details.cashAccountNodeId,
            warehouseId: details.warehouseId,
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
        return success({
          result: { ...terminal, warehouseName: warehouse?.name },
        });
      });
    } catch (error) {
      logger.error("Error creating POS terminal", parseError(error));
      return fail({
        message: t("terminalCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
