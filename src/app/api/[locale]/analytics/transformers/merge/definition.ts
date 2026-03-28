/**
 * Vibe Sense - Merge Transformer Definition
 *
 * Client+server safe. No server imports.
 * Sums two time series aligned by timestamp.
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
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesRequestField,
  timeSeriesResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TRANSFORMER_MERGE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [TRANSFORMER_MERGE_ALIAS],
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "transformers", "merge"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "endpointCategories.analyticsTransformers",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      a: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.a.label",
        description: "post.fields.a.description",
      }),
      b: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.b.label",
        description: "post.fields.b.description",
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
      result: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.result.label",
        description: "post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "post.fields.meta.label",
        description: "post.fields.meta.description",
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
        a: [
          { timestamp: new Date("2024-01-01"), value: 100 },
          { timestamp: new Date("2024-01-02"), value: 102 },
        ],
        b: [
          { timestamp: new Date("2024-01-01"), value: 50 },
          { timestamp: new Date("2024-01-02"), value: 48 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-02"),
        },
      },
    },
    responses: {
      default: {
        result: [
          { timestamp: new Date("2024-01-01"), value: 150 },
          { timestamp: new Date("2024-01-02"), value: 150 },
        ],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
