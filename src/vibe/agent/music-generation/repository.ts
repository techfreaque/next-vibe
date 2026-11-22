/**
 * Music Generation Repository
 * Handles music generation via multiple AI providers
 */

import "server-only";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../chat/storage/index";
import { isStorageUrl } from "../chat/storage/storage-url";
import {
  MediaStudioRepository,
  type StudioProgress,
} from "../media-studio/repository";
import { toStudioSettings } from "../media-studio/settings";
import { ApiProvider, calculateCreditCost } from "../models/models";
import { UncensoredConsentRepository } from "../models/uncensored-consent/repository";
import {
  chargeMediaGeneration,
  checkMediaBalance,
  deductMediaCredits,
  keepsExplicitMediaModel,
  resolveMediaReference,
} from "../shared/media-generation";
import { MUSIC_GEN_ALIAS } from "./constants";
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
  musicGenModelOptions,
  type MusicGenModelSelection,
} from "./models";
import { generateMusicWithFalAi } from "./providers/fal-ai";
import { generateMusicWithModelsLab } from "./providers/modelslab";
import { generateMusicWithOpenRouter } from "./providers/openrouter";
import { generateMusicWithReplicate } from "./providers/replicate";
import { generateMusicWithUnbottled } from "./providers/unbottled";

export class MusicGenerationRepository {
  /**
   * Generate music from a text prompt
   */
  static submit(
    data: MusicGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MusicGenerationT,
    toolExecutionContext: ToolExecutionContext,
    platform: Platform,
  ): Promise<ResponseType<MusicGenerationPostResponseOutput>> {
    return MediaStudioRepository.run({
      save: !toolExecutionContext.threadId && data.saveToStudio,
      kind: "music",
      model: data.model,
      title: data.prompt,
      settings: toStudioSettings(data),
      user,
      locale,
      logger,
      generate: (onProgress) =>
        MusicGenerationRepository.generateMusic(
          data,
          user,
          locale,
          logger,
          t,
          toolExecutionContext,
          platform,
          onProgress,
        ),
    });
  }

  static async generateMusic(
    data: MusicGenerationPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: MusicGenerationT,
    toolExecutionContext: ToolExecutionContext,
    platform: Platform,
    onProgress?: StudioProgress,
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

    const consent = await UncensoredConsentRepository.gate({
      content: audioModel.content,
      modelName: audioModel.name,
      user,
      locale,
      logger,
    });
    if (!consent.success) {
      return consent;
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
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);

    // Reference audio: own storage files are read here with the caller's
    // permissions and handed over as a data URI (providers have no session,
    // so a private-thread URL 404s for them).
    let inputMediaUrl: string | undefined;
    if (data.inputMediaUrl) {
      const resolvedReference = await resolveMediaReference(
        data.inputMediaUrl,
        user,
        logger,
        locale,
      );
      if (!resolvedReference) {
        return fail({
          message: t("post.errors.referenceUnavailable"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      inputMediaUrl = resolvedReference;
    }

    let generationResult: ResponseType<{
      audioUrl: string;
      /** Final credits already charged by a remote instance (UNBOTTLED). */
      creditCost?: number;
      /** Real upstream USD charge (no markup), when the provider reports one. */
      upstreamCostUsd?: number;
      durationSeconds?: number;
    }>;
    await onProgress?.("running");
    switch (audioModel.apiProvider) {
      case ApiProvider.REPLICATE:
        generationResult = await generateMusicWithReplicate({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          inputMediaUrl,
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
          inputMediaUrl,
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
          inputMediaUrl,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.OPENROUTER:
        generationResult = await generateMusicWithOpenRouter({
          providerModel: audioModel.providerModel,
          prompt: data.prompt,
          durationSeconds,
          logger,
          locale,
          fetchImpl,
        });
        break;

      case ApiProvider.UNBOTTLED:
        generationResult = await generateMusicWithUnbottled({
          input: {
            ...data,
            inputMediaUrl: inputMediaUrl ?? undefined,
            saveToStudio: undefined,
          },
          user,
          locale,
          logger,
          creditFeature: MUSIC_GEN_ALIAS,
          modelId: audioModel.id,
          toolExecutionContext,
          platform,
        });
        break;

      default:
        return fail({
          message: t("post.errors.providerUnsupported", {
            label: audioModel.apiProvider,
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

    await onProgress?.("saving");
    let { audioUrl } = generationResult.data;
    const finalDurationSeconds =
      generationResult.data.durationSeconds ?? durationSeconds;
    // Remote instance: what it charged. Otherwise the provider's real cost x
    // markup when reported (OpenRouter usage.cost), else the listed price.
    const finalCreditCost =
      generationResult.data.creditCost ??
      chargeMediaGeneration({
        upstreamCostUsd: generationResult.data.upstreamCostUsd,
        listedCredits: creditCost,
        reportsUpstreamCost: audioModel.apiProvider === ApiProvider.OPENROUTER,
        model: audioModel.id,
        logTag: "MusicGen",
        logger,
      });

    // Upload to our storage so the URL is persistent and access-controlled.
    // Incognito threads have no server-side thread row — the file is owned by
    // the caller's leadId and served only to that lead (browser).
    const scThreadId =
      toolExecutionContext.threadId ??
      (data.saveToStudio ? crypto.randomUUID() : undefined);
    const isIncognito = toolExecutionContext.threadId
      ? toolExecutionContext.rootFolderId === DefaultFolderId.INCOGNITO
      : user.isPublic;
    if (scThreadId) {
      try {
        const storage = getStorageAdapter();
        const media = await fetchImpl(audioUrl);
        if (!media.ok) {
          return fail({
            message: t("post.errors.generationFailed"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        }
        const arrayBuf = await media.arrayBuffer();
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

    if (data.saveToStudio && !isStorageUrl(audioUrl)) {
      return fail({
        message: t("post.errors.generationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    if (audioModel.apiProvider !== ApiProvider.UNBOTTLED) {
      const deductResult = await deductMediaCredits(
        user,
        finalCreditCost,
        MUSIC_GEN_ALIAS, // ledger id, translated when shown
        locale,
        logger,
        tCredits,
        { modelId: audioModel.id, apiProvider: audioModel.apiProvider },
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

    const toolMessageId = toolExecutionContext?.currentToolMessageId;
    if (toolMessageId && !user.isPublic) {
      const month = new Date().toISOString().slice(0, 7);
      const slug = `${data.prompt
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/^-|-$/g, "")
        .slice(0, 60)}-${toolMessageId}`;
      void Promise.all([
        import("../cortex/mounts/gens"),
        import("../cortex/embeddings/sync-virtual"),
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
                  toolExecutionContext,
                  logger,
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

  /**
   * A human's explicit model pick wins; AI/MCP callers (or an empty pick) get
   * the favorite/skill model.
   */
  static async getRequestDefaults(
    ctx: {
      user: JwtPayloadType;
      toolExecutionContext: ToolExecutionContext;
      platform: Platform;
    },
    requestedModel: string | undefined,
  ): Promise<Partial<MusicGenerationPostRequestInput>> {
    if (
      keepsExplicitMediaModel(ctx.platform, requestedModel, (model) =>
        musicGenModelOptions.some((option) => option.id === model),
      )
    ) {
      return {};
    }
    const { getEnvAvailability } = await import("../env-availability");
    const availability = await getEnvAvailability();
    const userId =
      ctx.user && !ctx.user.isPublic && "id" in ctx.user
        ? ctx.user.id
        : undefined;
    // The stream already resolved this (client favorite config -> favorite
    // -> skill -> default) in setup and advertised it in the system prompt.
    // Re-querying the favorite from the DB diverged whenever the client's
    // favorite was not a saved row: a different model generated than the
    // one the user picked. Only stream-less callers re-run the cascade.
    let sel: MusicGenModelSelection | undefined =
      ctx.toolExecutionContext.resolvedMediaSelections?.musicGenModelSelection;
    if (!sel && userId) {
      const { resolveSkillFavoriteContext } =
        await import("../skills/resolver");
      const { ModalityResolver } =
        await import("../ai-stream/repository/core/modality-resolver");
      const { favorite, skill } = await resolveSkillFavoriteContext({
        favoriteId: ctx.toolExecutionContext.favoriteId ?? null,
        skillId: ctx.toolExecutionContext.skillId ?? null,
        userId,
      });
      sel = ModalityResolver.resolveMusicGenSelection({ favorite, skill });
    }
    const model = filterMusicGenModels(sel, ctx.user, availability)[0]?.id;
    if (!model) {
      return {};
    }
    return { model };
  }
}
