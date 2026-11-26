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
import type { StudioSettings } from "./settings";

export type StudioProgress = (status: "running" | "saving") => Promise<void>;
export type ProviderJobIdRecorder = (providerJobId: string) => void;

export interface StudioRunCallbacks {
  progress?: StudioProgress;
  recordProviderJobId?: ProviderJobIdRecorder;
}

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
    /** Form values to prefill "Run again" with (see settings.ts). */
    settings: StudioSettings;
    locale: CountryLanguage;
    logger: EndpointLogger;
    generate: (callbacks: StudioRunCallbacks) => Promise<ResponseType<T>>;
  }): Promise<ResponseType<T>> {
    if (!params.save) {
      return params.generate({});
    }
    const { user, kind, model, title, settings, locale, logger } = params;
    const { t } = scopedTranslation.scopedT(locale);
    const id = crypto.randomUUID();
    type Row = Partial<typeof studioGenerations.$inferInsert>;
    // The row is written once the run gets past its checks (first progress
    // or the final result): a refusal (no credits, no consent) never shows
    // up as a card, and nothing has to be deleted again.
    let created = false;
    let recordedProviderJobId: string | undefined;
    const save = async (values: Row): Promise<void> => {
      if (created) {
        await db
          .update(studioGenerations)
          .set(values)
          .where(eq(studioGenerations.id, id));
        return;
      }
      created = true;
      await db.insert(studioGenerations).values({
        id,
        kind,
        model: model ?? "",
        title: title.trim().slice(0, 160),
        settings,
        status: "running",
        providerJobId: recordedProviderJobId ?? null,
        userId: user.isPublic ? null : user.id,
        leadId: user.isPublic ? user.leadId : null,
        ...values,
      });
    };
    const progress: StudioProgress = async (status) => {
      await save({ status }).catch((error: Error) => {
        logger.warn("Could not update Studio progress", {
          id,
          error: error.message,
        });
      });
    };
    const recordProviderJobId: ProviderJobIdRecorder = (providerJobId) => {
      const trimmed = providerJobId.trim();
      if (!trimmed) {
        return;
      }
      recordedProviderJobId = trimmed;
      if (created) {
        void db
          .update(studioGenerations)
          .set({ providerJobId: trimmed })
          .where(eq(studioGenerations.id, id))
          .catch((error: Error) => {
            logger.warn("Could not record Studio provider job ID", {
              id,
              error: error.message,
            });
          });
      }
    };
    const result = await params
      .generate({ progress, recordProviderJobId })
      .catch((error: Error) => {
        logger.error("Studio generation failed", parseError(error));
        return fail({
          message: t("failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      });
    const refused =
      !result.success &&
      (result.errorType.errorCode ===
        ErrorResponseTypes.PAYMENT_REQUIRED.errorCode ||
        result.errorType.errorCode === ErrorResponseTypes.FORBIDDEN.errorCode);
    if (refused) {
      if (created) {
        await db
          .delete(studioGenerations)
          .where(eq(studioGenerations.id, id))
          .catch((error: Error) => {
            logger.warn("Could not drop refused Studio generation", {
              id,
              error: error.message,
            });
          });
      }
      return result;
    }
    // A bookkeeping error after billing must not turn a delivered result into a retry.
    await save(
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
            ...(recordedProviderJobId
              ? { providerJobId: recordedProviderJobId }
              : {}),
          }
        : {
            status: "failed",
            ...(recordedProviderJobId
              ? { providerJobId: recordedProviderJobId }
              : {}),
          },
    ).catch((error: Error) => {
      logger.error("Could not save Studio result", {
        id,
        error: parseError(error).message,
      });
    });
    return result;
  }
}
