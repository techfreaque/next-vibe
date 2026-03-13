/**
 * Vibe Sense — Script Evaluator Endpoint Definition
 *
 * Client+server safe. No server imports.
 * Sandboxed custom evaluation via user-provided function body. Admin-only.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
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
import { scopedTranslation } from "./i18n";
import { EVALUATOR_SCRIPT_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EVALUATOR_SCRIPT_ALIAS],
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "evaluators", "script"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsEvaluators",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      source: timeSeriesRequestField(scopedTranslation, {
        label: "post.fields.source.label",
        description: "post.fields.source.description",
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
      fn: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.fn.label",
        description: "post.fields.fn.description",
        schema: z.string().min(1),
        columns: 12,
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
        source: [
          { timestamp: new Date("2024-01-01"), value: 100 },
          { timestamp: new Date("2024-01-02"), value: 105 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-02"),
        },
        fn: "(inputs) => inputs.map(p => ({ timestamp: p.timestamp, fired: p.value > 102 }))",
      },
    },
    responses: {
      default: {
        signals: [
          { timestamp: new Date("2024-01-01"), fired: false },
          { timestamp: new Date("2024-01-02"), fired: true },
        ],
      },
    },
  },
});

const definitions = { POST };
export default definitions;
