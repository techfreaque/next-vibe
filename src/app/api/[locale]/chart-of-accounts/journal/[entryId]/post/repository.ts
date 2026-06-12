/**
 * Chart of Accounts — Journal Post Repository
 * Changes DRAFT → POSTED, records postedAt and postedByUserId
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { journalEntries } from "../../../db";
import { JournalEntryStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { CoaJournalPostRequestOutput } from "./definition";

export class CoaJournalPostRepository {
  static async postEntry(
    data: CoaJournalPostRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ posted: boolean }>> {
    try {
      const { t } = scopedTranslation.scopedT(locale);

      const [entry] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, data.entryId))
        .limit(1);

      if (!entry) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ACCOUNTANT+ membership using the entry's companyId
      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        entry.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      if (entry.status === JournalEntryStatus.POSTED) {
        return fail({
          message: t("journalPost.errorAlreadyPosted"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      if (entry.status !== JournalEntryStatus.DRAFT) {
        return fail({
          message: t("journalPost.errorNotDraft"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .update(journalEntries)
        .set({
          status: JournalEntryStatus.POSTED,
          postedAt: new Date(),
          postedByUserId: user.id,
          updatedAt: new Date(),
        })
        .where(eq(journalEntries.id, data.entryId));

      logger.info("Journal entry posted", {
        entryId: data.entryId,
        userId: user.id,
      });

      return success({ posted: true });
    } catch (error) {
      logger.error("Error posting journal entry", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
