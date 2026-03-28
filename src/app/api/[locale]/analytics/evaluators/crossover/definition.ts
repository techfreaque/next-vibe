/**
 * Vibe Sense - Crossover Evaluator Endpoint Definition
 *
 * Client+server safe. No server imports.
 * Fires when series A crosses above series B.
 */

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  lookbackRequestField,
  rangeRequestField,
  resolutionRequestField,
  signalsResponseField,
  timeSeriesRequestField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { EVALUATOR_CROSSOVER_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EVALUATOR_CROSSOVER_ALIAS],
  method: Methods.POST,
  path: [
    "system",
    "unified-interface",
    "vibe-sense",
    "evaluators",
    "crossover",
  ],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "endpointCategories.analyticsEvaluators",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      seriesA: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.seriesA.label",
        description: "post.fields.seriesA.description",
      }),
      seriesB: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.seriesB.label",
        description: "post.fields.seriesB.description",
      }),
      resolution: resolutionRequestField(scopedTranslation, {
        label: "post.fields.resolution.label",
        description: "post.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "post.fields.range.label",
        description: "post.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "post.fields.lookback.label",
        description: "post.fields.lookback.description",
      }),
      signals: signalsResponseField(scopedTranslation, {
        label: "post.fields.signals.label",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        seriesA: [
          { timestamp: new Date("2024-01-01"), value: 98 },
          { timestamp: new Date("2024-01-02"), value: 102 },
          { timestamp: new Date("2024-01-03"), value: 105 },
        ],
        seriesB: [
          { timestamp: new Date("2024-01-01"), value: 100 },
          { timestamp: new Date("2024-01-02"), value: 100 },
          { timestamp: new Date("2024-01-03"), value: 100 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-03"),
        },
      },
    },
    responses: {
      default: {
        signals: [
          {
            timestamp: new Date("2024-01-02"),
            fired: true,
            meta: { a: 102, b: 100 },
          },
          {
            timestamp: new Date("2024-01-03"),
            fired: false,
            meta: { a: 105, b: 100 },
          },
        ],
      },
    },
  },
});

const definitions = { POST };
export default definitions;
