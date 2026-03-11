/**
 * Vibe Sense — Graph Edit (Branch) Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as vibeSenseScopedTranslation } from "../../../i18n";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    handler: async ({ data, urlPathParams, user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      if (!urlPathParams.id || urlPathParams.id === "new") {
        const result = await VibeSenseRepository.createGraph(
          {
            name: data.name ?? "New Graph",
            slug: data.slug ?? `graph-${Date.now()}`,
            description: data.description,
            config: data.config ?? {
              nodes: {},
              edges: [],
              trigger: { type: "manual" },
            },
          },
          user,
          logger,
          t,
        );
        if (!result.success) {
          return result;
        }
        return { ...result, data: { newId: result.data.id } };
      }
      return VibeSenseRepository.editGraph(
        urlPathParams.id,
        {
          name: data.name,
          slug: data.slug,
          description: data.description,
          config: data.config,
        },
        user,
        logger,
        t,
      );
    },
  },
});
