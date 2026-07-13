/**
 * Chart of Accounts — Journal Post Repository
 * Changes DRAFT → POSTED, records postedAt and postedByUserId
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
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

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
