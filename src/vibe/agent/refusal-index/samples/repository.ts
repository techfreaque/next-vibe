/**
 * Refusal Index - Samples Repository
 * Admin approval of public sample answers. Nothing is public without a row here.
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
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { invalidateRefusalIndexCaches } from "../cache";
import { refusalIndexResults, refusalIndexSamples } from "../db";
import { RefusalVerdict } from "../enum";
import { scopedTranslation } from "../i18n";
import type {
  SamplesPostRequestOutput,
  SamplesPostResponseOutput,
} from "./definition";

export class RefusalSamplesRepository {
  static async setVisibility(
    data: SamplesPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SamplesPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [result] = await db
        .select({
          id: refusalIndexResults.id,
          verdict: refusalIndexResults.verdict,
        })
        .from(refusalIndexResults)
        .where(eq(refusalIndexResults.id, data.resultId))
        .limit(1);
      if (!result) {
        return fail({
          message: t("messages.resultNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (data.visible && result.verdict === RefusalVerdict.ERROR) {
        return fail({
          message: t("messages.errorNotPublishable"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const [row] = await db
        .insert(refusalIndexSamples)
        .values({
          resultId: result.id,
          approvedBy: user.isPublic ? null : user.id,
          visible: data.visible,
        })
        .onConflictDoUpdate({
          target: [refusalIndexSamples.resultId],
          set: {
            visible: data.visible,
            approvedBy: user.isPublic ? null : user.id,
            approvedAt: new Date(),
          },
        })
        .returning({
          id: refusalIndexSamples.id,
          visible: refusalIndexSamples.visible,
        });
      if (!row) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      invalidateRefusalIndexCaches();
      return success({ sampleId: row.id, isVisible: row.visible });
    } catch (error) {
      logger.error(
        "RefusalSamplesRepository.setVisibility failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
