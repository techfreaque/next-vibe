/**
 * Music Generation API Route
 * Handles music generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
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
    fieldDefaults: {
      model: async (ctx) => {
        if (!ctx.user) {
          return undefined;
        }
        const { resolveFavoriteConfig } =
          await import("@/app/api/[locale]/agent/skills/favorites/repository");
        const { resolveSkillVariant } =
          await import("@/app/api/[locale]/agent/skills/resolver");
        const userId =
          !ctx.user.isPublic && "id" in ctx.user ? ctx.user.id : undefined;
        const fav = await resolveFavoriteConfig(
          ctx.streamContext.favoriteId,
          userId,
        );
        const { parseSkillId } =
          await import("@/app/api/[locale]/agent/chat/slugify");
        const skill = await resolveSkillVariant(
          ctx.streamContext.skillId,
          fav ? parseSkillId(fav.skillId).variantId : null,
        );
        const sel =
          skill?.musicGenModelSelection ?? fav?.musicGenModelSelection;
        if (!sel) {
          return undefined;
        }
        const { getInstanceAvailability } =
          await import("@/app/api/[locale]/agent/env-availability");
        const _routeAvailability = await getInstanceAvailability();
        const { getBestMusicGenModel } = await import("./models");
        return getBestMusicGenModel(sel, ctx.user, _routeAvailability)?.id;
      },
    },
  },
});
