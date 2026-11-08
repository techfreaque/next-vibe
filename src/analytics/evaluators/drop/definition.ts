/**
 * Vibe Sense - Drop Evaluator Endpoint Definition
 *
 * Client+server safe. No server imports.
 * Fires when a value falls sharply below its own trailing average.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  lookbackRequestField,
  rangeRequestField,
  resolutionRequestField,
  signalsResponseField,
  timeSeriesRequestField,
} from "next-vibe/dataflow/shared/fields";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  backButton,
  objectField,
  requestField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { EVALUATOR_DROP_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EVALUATOR_DROP_ALIAS],
  method: Methods.POST,
  path: ["analytics", "evaluators", "drop"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "Evaluators",
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
      window: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.window.label",
        description: "post.fields.window.description",
        schema: z.number().int().min(2).max(500).default(14),
        columns: 4,
      }),
      dropPct: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.dropPct.label",
        description: "post.fields.dropPct.description",
        schema: z.number().min(0.01).max(1).default(0.5),
        columns: 4,
      }),
      minBaseline: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.minBaseline.label",
        description: "post.fields.minBaseline.description",
        schema: z.number().min(0).default(0),
        columns: 4,
      }),
      signals: signalsResponseField(scopedTranslation, {
        label: "post.fields.signals.label",
      }),

      // === NAVIGATION ===
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
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
          { timestamp: new Date("2024-01-01"), value: 0.2 },
          { timestamp: new Date("2024-01-02"), value: 0.22 },
          { timestamp: new Date("2024-01-03"), value: 0.05 },
        ],
        range: {
          from: new Date("2024-01-01"),
          to: new Date("2024-01-03"),
        },
        window: 2,
        dropPct: 0.5,
        minBaseline: 0,
      },
    },
    responses: {
      default: {
        signals: [
          {
            timestamp: new Date("2024-01-03"),
            fired: true,
            meta: { baseline: 0.21, actual: 0.05, change: -0.76 },
          },
        ],
      },
    },
  },
});

export type DropRequestOutput = typeof POST.types.RequestOutput;

const definitions = { POST };
export default definitions;
