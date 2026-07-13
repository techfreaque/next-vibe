/**
 * Chart of Accounts Setup Repository
 * Initializes a company's chart of accounts from a country template
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { accountNodes, coaTemplateNodes, coaTemplates } from "../db";
import type { CoaSetupRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CoaSetupRepository {
  static async setupChartOfAccounts(
    data: CoaSetupRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ created: number; skipped: number }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      // Verify ADMIN+ company membership
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

      // Find the template for this country
      const [template] = await db
        .select()
        .from(coaTemplates)
        .where(eq(coaTemplates.country, data.country))
        .limit(1);

      if (!template) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get all template nodes
      const templateNodes = await db
        .select()
        .from(coaTemplateNodes)
        .where(eq(coaTemplateNodes.templateId, template.id))
        .orderBy(coaTemplateNodes.sortOrder);

      // Get existing account codes for this company (idempotency)
      const existingAccounts = await db
        .select({ code: accountNodes.code })
        .from(accountNodes)
        .where(eq(accountNodes.companyId, data.companyId));

      const existingCodes = new Set(existingAccounts.map((a) => a.code));

      // Build a map from code → new accountNode id for parent resolution
      const codeToId = new Map<string, string>();

      // First pass: generate IDs for all nodes that will be inserted
      const toInsert = templateNodes.filter(
        (node) => !existingCodes.has(node.code),
      );

      // Pre-generate IDs so parent relationships can be resolved
      const nodeIdMap = new Map<string, string>();
      for (const node of toInsert) {
        const newId = crypto.randomUUID();
        nodeIdMap.set(node.code, newId);
      }

      // Populate existing codes into codeToId
      const existingWithIds = await db
        .select({ code: accountNodes.code, id: accountNodes.id })
        .from(accountNodes)
        .where(eq(accountNodes.companyId, data.companyId));
      for (const existing of existingWithIds) {
        codeToId.set(existing.code, existing.id);
      }

      // Merge new IDs
      for (const [code, id] of nodeIdMap.entries()) {
        codeToId.set(code, id);
      }

      if (toInsert.length === 0) {
        logger.info("Chart of accounts already initialized", {
          companyId: data.companyId,
          country: data.country,
        });
        return success({
          created: 0,
          skipped: existingCodes.size,
        });
      }

      // Build insert values
      const insertValues = toInsert.map((node) => ({
        id: nodeIdMap.get(node.code),
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
      }));

      await db.insert(accountNodes).values(insertValues);

      logger.info("Chart of accounts initialized", {
        companyId: data.companyId,
        country: data.country,
        created: toInsert.length,
        skipped: existingCodes.size,
      });

      return success({
        created: toInsert.length,
        skipped: existingCodes.size,
      });
    } catch (error) {
      logger.error("Error setting up chart of accounts", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
