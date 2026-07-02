/**
 * Video Generation API Route
 * Handles video generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { VideoGenerationRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      VideoGenerationRepository.generateVideo(
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
          skill?.videoGenModelSelection ?? fav?.videoGenModelSelection;
        if (!sel) {
          return undefined;
        }
        // MANUAL selection: honor the user's explicit model choice without the
        // provider-availability filter. Availability is a property of the
        // EXECUTING instance — this default may be resolved by a dispatching
        // caller whose local keys differ from the executor's (remote dispatch
        // pre-resolves caller-context defaults). The handler validates the
        // model against real availability at execution time.
        const { videoGenModelSelectionSchema } = await import("./models");
        const { ModelSelectionType } = await import("../skills/enum");
        const parsed = videoGenModelSelectionSchema.safeParse(sel);
        if (
          parsed.success &&
          parsed.data.selectionType === ModelSelectionType.MANUAL &&
          "manualModelId" in parsed.data
        ) {
          return parsed.data.manualModelId;
        }
        const { getInstanceAvailability } = await import("../env-availability");
        const _routeAvailability = await getInstanceAvailability();
        const { getBestVideoGenModel } = await import("./models");
        return getBestVideoGenModel(sel, ctx.user, _routeAvailability)?.id;
      },
    },
  },
});
