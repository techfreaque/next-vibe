/**
 * Music Generation API Route
 * Handles music generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import type { MusicGenModelSelection } from "./models";
import { MusicGenerationRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      MusicGenerationRepository.generateMusic(
        data,
        user,
        locale,
        logger,
        t,
        streamContext,
      ),
    requestDefaults: async (ctx) => {
      const { getInstanceAvailability } = await import("../env-availability");
      const availability = await getInstanceAvailability();
      const { getBestMusicGenModel } = await import("./models");
      const userId =
        ctx.user && !ctx.user.isPublic && "id" in ctx.user
          ? ctx.user.id
          : undefined;
      let sel: MusicGenModelSelection | undefined;
      if (userId) {
        const { resolveSkillFavoriteContext } =
          await import("@/app/api/[locale]/agent/skills/resolver");
        const { ModalityResolver } =
          await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
        const { favorite, skill } = await resolveSkillFavoriteContext({
          favoriteId: ctx.streamContext.favoriteId ?? null,
          skillId: ctx.streamContext.skillId ?? null,
          userId,
        });
        sel = ModalityResolver.resolveMusicGenSelection({ favorite, skill });
      }
      sel ??= ctx.streamContext.resolvedMediaSelections?.musicGenModelSelection;
      const model = getBestMusicGenModel(sel, ctx.user, availability)?.id;
      console.log("[MusicGen]", JSON.stringify({ sel, model, modelsLab: availability.modelsLab, isPublic: ctx.user.isPublic }));
      if (!model) {
        return {};
      }
      return { model };
    },
  },
});
