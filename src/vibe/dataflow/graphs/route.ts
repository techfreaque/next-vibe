/**
 * Vibe Sense - Graphs List + Create Route
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import { VibeSenseRepository } from "../repository";
import definitions from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      VibeSenseRepository.listGraphs(user, logger, locale, data.search),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      VibeSenseRepository.createGraph(
        {
          name: data.name,
          slug: data.slug,
          description: data.description,
          config: data.config ?? {
            nodes: {},
            edges: [],
            positions: {},
            trigger: { type: "manual" },
          },
        },
        user,
        logger,
        locale,
      ),
  },
});
