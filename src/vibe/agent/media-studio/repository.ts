import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { CreateKind } from "@/_pages/create/_shared/create-kinds";
import { scopedTranslation } from "@/_pages/create/i18n";

import { studioGenerations } from "./db";

export type StudioProgress = (status: "running" | "saving") => Promise<void>;

interface MediaOutput {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  response?: { text: string };
  creditCost?: number;
}

export class MediaStudioRepository {
  /** Only Studio submissions opt in. Chat, incognito and API calls retain their own storage rules. */
  static async run<T extends MediaOutput>(params: {
    save: boolean | undefined;
    user: JwtPayloadType;
    kind: CreateKind;
    model: string | undefined;
    title: string;
    locale: CountryLanguage;
    logger: EndpointLogger;
    generate: (progress?: StudioProgress) => Promise<ResponseType<T>>;
  }): Promise<ResponseType<T>> {
    if (!params.save) {
      return params.generate();
    }
    const { user, kind, model, title, locale, logger } = params;
    const { t } = scopedTranslation.scopedT(locale);
    const id = crypto.randomUUID();
    try {
      await db.insert(studioGenerations).values({
        id,
        kind,
        model: model ?? "",
        title: title.trim().slice(0, 160),
        status: kind === "video" || kind === "music" ? "queued" : "running",
        userId: user.isPublic ? null : user.id,
        leadId: user.isPublic ? user.leadId : null,
      });
    } catch (error) {
      logger.error("Could not start Studio generation", parseError(error));
      return fail({
        message: t("historyError"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
    const progress: StudioProgress = async (status) => {
      await db
        .update(studioGenerations)
        .set({ status })
        .where(eq(studioGenerations.id, id))
        .catch((error: Error) => {
          logger.warn("Could not update Studio progress", {
            id,
            error: error.message,
          });
        });
    };
    const result = await params.generate(progress).catch((error: Error) => {
      logger.error("Studio generation failed", parseError(error));
      return fail({
        message: t("failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    });
    // A bookkeeping error after billing must not turn a delivered result into a retry.
    await db
      .update(studioGenerations)
      .set(
        result.success
          ? {
              status: "completed",
              url:
                result.data.imageUrl ??
                result.data.videoUrl ??
                result.data.audioUrl ??
                null,
              transcript: result.data.response?.text ?? null,
              credits: result.data.creditCost ?? null,
            }
          : { status: "failed" },
      )
      .where(eq(studioGenerations.id, id))
      .catch((error: Error) => {
        logger.error("Could not save Studio result", {
          id,
          error: parseError(error).message,
        });
      });
    return result;
  }
}
