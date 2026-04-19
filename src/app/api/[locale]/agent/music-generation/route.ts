/**
 * Music Generation API Route
 * Handles music generation requests via multiple AI providers
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { getBestMusicGenModel } from "./models";
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
          await import("@/app/api/[locale]/agent/chat/favorites/repository");
        const { resolveSkillVariant } =
          await import("@/app/api/[locale]/agent/chat/skills/resolver");
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
        return getBestMusicGenModel(
          sel,
          ctx.user,
          ctx.streamContext.providerOverride,
        )?.id;
      },
    },
  },
});
