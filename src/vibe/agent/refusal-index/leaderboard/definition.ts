/**
 * Refusal Index - Leaderboard API Definition (public, read-only, cached)
 * GET /agent/refusal-index/leaderboard - latest completed run: per model
 * answered / hedged / refused %, by category, trend vs the previous run.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { REFUSAL_INDEX_LEADERBOARD_ALIAS } from "../constants";
import { REFUSAL_ERROR_TYPES, REFUSAL_SUCCESS_TYPES } from "../error-types";
import { scopedTranslation } from "../i18n";
import {
  categoryBreakdownField,
  rateFields,
  runMetaFields,
} from "../public-fields";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "refusal-index", "leaderboard"],
  aliases: [REFUSAL_INDEX_LEADERBOARD_ALIAS],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ] as const,

  title: "leaderboard.title" as const,
  titleShort: "leaderboard.titleShort" as const,
  description: "leaderboard.description" as const,
  icon: "trophy",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.refusalIndex" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { response: true } as const,
    children: {
      ...runMetaFields,
      overall: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        columns: 12,
        title: "leaderboard.response.overall" as const,
        usage: { response: true },
        children: rateFields,
      }),
      categories: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),
      models: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true } as const,
          children: {
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.modelId.label" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.name.label" as const,
              schema: z.string(),
            }),
            tier: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "public.fields.tier.label" as const,
              schema: z.string(),
            }),
            ...rateFields,
            trend: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "public.fields.trend.label" as const,
              schema: z.number().nullable(),
            }),
            categoryBreakdown: categoryBreakdownField,
          },
        }),
      }),
    },
  }),

  errorTypes: REFUSAL_ERROR_TYPES,
  successTypes: REFUSAL_SUCCESS_TYPES,

  examples: {
    responses: {
      default: {
        hasData: false,
        runId: null,
        runFinishedAt: null,
        modelCount: 0,
        questionCount: 0,
        judgeModelId: null,
        judgeModelName: null,
        judgePromptVersion: null,
        overall: { judged: 0, answeredPct: 0, hedgedPct: 0, refusedPct: 0 },
        categories: [],
        models: [],
      },
    },
  },
});

export const endpoints = { GET };
export type LeaderboardResponseOutput = typeof GET.types.ResponseOutput;
export default endpoints;
