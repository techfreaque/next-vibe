/**
 * Music Generation Repository
 * Handles music generation via multiple AI providers
 */

import "server-only";

import { createFixtureFetch } from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "next-vibe/agent/chat/storage/index";
import {
  ApiProvider,
  calculateCreditCost,
} from "next-vibe/agent/models/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId, type ToolExecutionContext } from "../chat/config";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../shared/media-generation";
import {
  type MusicGenerationPostRequestInput,
  type MusicGenerationPostRequestOutput,
  type MusicGenerationPostResponseOutput,
} from "./definition";
import { MUSIC_DURATION_SECONDS } from "./enum";
import type { MusicGenerationT } from "./i18n";
import {
  filterMusicGenModels,
  getMusicGenModelById,
  type MusicGenModelSelection,
} from "./models";
import { generateMusicWithFalAi } from "./providers/fal-ai";
import { generateMusicWithModelsLab } from "./providers/modelslab";
import { generateMusicWithReplicate } from "./providers/replicate";
import { generateMusicWithUnbottled } from "./providers/unbottled";

export class MusicGenerationRepository {
  /**
   * Generate music from a text prompt
   */
  static async generateMusic(
    data: MusicGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MusicGenerationT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<MusicGenerationPostResponseOutput>> {
    // model is resolved via requestDefaults in route.ts (from favorites/skill config)
    if (!data.model) {
      return fail({
        message: t("post.errors.noModelConfigured"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const audioModel = getMusicGenModelById(data.model);

    if (!audioModel) {
      return fail({
        message: t("post.errors.not_found.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const creditCost = calculateCreditCost(audioModel, 0, 0);
    const requestedDuration =
      MUSIC_DURATION_SECONDS[data.duration] ??
      audioModel.defaultDurationSeconds;

    // Clamp to model's minimum duration first
    const clampedDuration = Math.max(
      requestedDuration,
      audioModel.minDurationSeconds ?? 0,
    );

    // If model has a specific list of allowed durations, snap to the closest supported one.
    // supportedDurations may hold enum keys (e.g. "post.duration.long") or seconds as strings.
    let durationSeconds = clampedDuration;
    if (
      audioModel.supportedDurations &&
      audioModel.supportedDurations.length > 0 &&
      !audioModel.supportedDurations.includes(data.duration) &&
      !audioModel.supportedDurations.includes(String(clampedDuration))
    ) {
      // Map each supported entry to seconds (resolve enum keys, fall back to numeric parse)
      const supportedSeconds = audioModel.supportedDurations.map(
        (d) => MUSIC_DURATION_SECONDS[d] ?? Number(d),
      );
      const nearest = supportedSeconds.reduce((prev, curr) =>
        Math.abs(curr - clampedDuration) < Math.abs(prev - clampedDuration)
          ? curr
          : prev,
      );
      durationSeconds = nearest;
    }

    logger.debug("[MusicGen] Starting music generation", {
      model: data.model,
      provider: audioModel.apiProvider,
      creditCost,
      durationSeconds,
      promptLength: data.prompt.length,
    });

    const balanceCheck = await checkMediaBalance(
      user,
      creditCost,
      locale,
      logger,
    );
    if (!balanceCheck.success) {
      return balanceCheck;
    }
    const { tCredits } = balanceCheck.data;

    // One fixture-aware fetch per generation - carries the repeat counter for
    // poll loops, so it must not be recreated per call.
    const fetchImpl = createFixtureFetch(streamContext, logger);

    let generationResult: ResponseType<{
      audioUrl: string;
      creditCost?: number;
      durationSeconds?: number;
    }>;
    switch (audioModel.apiProvider) {
      case ApiProvider.REPLICATE:
        generationResult = await generateMusicWithReplicate({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.FAL_AI:
        generationResult = await generateMusicWithFalAi({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.MODELSLAB:
        generationResult = await generateMusicWithModelsLab({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          inputMediaUrl: data.inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateMusicWithUnbottled({
          input: data,
          user,
          locale,
          logger,
          featureLabel: t("post.title"),
          streamContext,
        });
        break;

      default:
        return fail({
          message: t("post.errors.notConfigured", {
            label: audioModel.apiProvider,
            envKey: "N/A",
            url: "",
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
    }

    if (!generationResult.success) {
      return fail({
        message: t("post.errors.generationFailed", {
          error: generationResult.message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let { audioUrl } = generationResult.data;
    const finalDurationSeconds =
      generationResult.data.durationSeconds ?? durationSeconds;
    const finalCreditCost = generationResult.data.creditCost ?? creditCost;

    // Upload to our storage so the URL is persistent and access-controlled.
    // Incognito threads have no server-side thread row — the file is owned by
    // the caller's leadId and served only to that lead (browser).
    const scThreadId = streamContext?.threadId;
    const isIncognito =
      streamContext?.rootFolderId === DefaultFolderId.INCOGNITO;
    if (scThreadId) {
      try {
        const storage = getStorageAdapter();
        const arrayBuf = await fetchImpl(audioUrl).then((r) => r.arrayBuffer());
        const audioBuffer = Buffer.from(new Uint8Array(arrayBuf));
        const uploadResult = await storage.uploadFile(audioBuffer, {
          filename: `generated-audio-${Date.now()}.mp3`,
          mimeType: "audio/mpeg",
          threadId: scThreadId,
          userId: isIncognito ? undefined : user.id,
          leadId: isIncognito ? user.leadId : undefined,
        });
        audioUrl = uploadResult.url;
      } catch (uploadErr) {
        logger.error(
          "[MusicGen] Failed to upload to storage, using provider URL",
          {
            error:
              uploadErr instanceof Error
                ? uploadErr.message
                : String(uploadErr),
          },
        );
      }
    }

    if (audioModel.apiProvider !== ApiProvider.UNBOTTLED) {
      const deductResult = await deductMediaCredits(
        user,
        finalCreditCost,
        t("post.title"),
        locale,
        logger,
        tCredits,
      );
      if (!deductResult.success) {
        return deductResult;
      }
    }

    logger.debug("[MusicGen] Music generated successfully", {
      model: data.model,
      creditCost: finalCreditCost,
      durationSeconds: finalDurationSeconds,
    });

    const toolMessageId = streamContext?.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("next-vibe/agent/cortex/mounts/gens"),
        import("next-vibe/agent/cortex/embeddings/sync-virtual"),
      ])
        .then(([{ readGenPath }, { syncVirtualNodeToEmbedding }]) => {
          const path = `/gens/audio/${month}/${slug}.md`;
          return readGenPath(user.id, path)
            .then(
              (result) =>
                result &&
                syncVirtualNodeToEmbedding(
                  user.id,
                  path,
                  result.content,
                  streamContext,
                ),
            )
            .catch(() => undefined);
        })
        .catch(() => undefined);
    }

    return success({
      audioUrl,
      creditCost: finalCreditCost,
      durationSeconds: finalDurationSeconds,
    });
  }

  static async getRequestDefaults(ctx: {
    user: JwtPayloadType;
    streamContext: ToolExecutionContext;
  }): Promise<Partial<MusicGenerationPostRequestInput>> {
    const { getInstanceAvailability } = await import("../env-availability");
    const availability = await getInstanceAvailability();
    const userId =
      ctx.user && !ctx.user.isPublic && "id" in ctx.user
        ? ctx.user.id
        : undefined;
    let sel: MusicGenModelSelection | undefined;
    if (userId) {
      const { resolveSkillFavoriteContext } =
        await import("next-vibe/agent/skills/resolver");
      const { ModalityResolver } =
        await import("next-vibe/agent/ai-stream/repository/core/modality-resolver");
      const { favorite, skill } = await resolveSkillFavoriteContext({
        favoriteId: ctx.streamContext.favoriteId ?? null,
        skillId: ctx.streamContext.skillId ?? null,
        userId,
      });
      sel = ModalityResolver.resolveMusicGenSelection({ favorite, skill });
    }
    sel ??= ctx.streamContext.resolvedMediaSelections?.musicGenModelSelection;
    const model = filterMusicGenModels(sel, ctx.user, availability)[0]?.id;
    if (!model) {
      return {};
    }
    return { model };
  }
}
