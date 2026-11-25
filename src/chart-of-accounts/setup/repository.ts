/**
 * Initializes a company's chart of accounts from a country template.
 */

import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { accountNodes, coaTemplateNodes, coaTemplates } from "../db";
import {
  type LedgerTransaction,
  lockLedgerCompany,
} from "../shared/ledger-write";
import type { CoaSetupRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaSetupRepository {
  static async setupChartOfAccounts(
    data: CoaSetupRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ created: number; skipped: number }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      return await db.transaction(async (tx) => {
        if (!(await lockLedgerCompany(tx, data.companyId))) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return CoaSetupRepository.seedChartOfAccounts(tx, data, locale);
      });
    } catch (error) {
      logger.error("Error setting up chart of accounts", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** The caller must hold the company row lock. All response failures precede writes. */
  static async seedChartOfAccounts(
    tx: LedgerTransaction,
    data: CoaSetupRequestOutput,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ created: number; skipped: number }>> {
    const { t } = scopedTranslation.scopedT(locale);
    const [template] = await tx
      .select({ id: coaTemplates.id })
      .from(coaTemplates)
      .where(eq(coaTemplates.country, data.country))
      .orderBy(desc(coaTemplates.isDefault), asc(coaTemplates.id))
      .limit(1);

    if (!template) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const templateNodes = await tx
      .select()
      .from(coaTemplateNodes)
      .where(eq(coaTemplateNodes.templateId, template.id))
      .orderBy(asc(coaTemplateNodes.sortOrder));
    if (templateNodes.length === 0) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const existingAccounts = await tx
      .select({ code: accountNodes.code, id: accountNodes.id })
      .from(accountNodes)
      .where(eq(accountNodes.companyId, data.companyId));
    const codeToId = new Map(
      existingAccounts.map((account) => [account.code, account.id]),
    );

    const toInsert = templateNodes
      .filter((node) => !codeToId.has(node.code))
      .map((node) => {
        const id = crypto.randomUUID();
        codeToId.set(node.code, id);
        return { id, node };
      });
    if (toInsert.length > 0) {
      await tx.insert(accountNodes).values(
        toInsert.map(({ id, node }) => ({
          id,
          companyId: data.companyId,
          templateNodeId: node.id,
          code: node.code,
          name: node.name,
          type: node.type,
          subtype: node.subtype,
          parentId: node.parentCode
            ? (codeToId.get(node.parentCode) ?? null)
            : null,
          isPostable: node.isPostable,
          isActive: true,
          isSystem: true,
          sortOrder: node.sortOrder,
        })),
      );
    }

    return success({
      created: toInsert.length,
      skipped: templateNodes.length - toInsert.length,
    });
  }
}
