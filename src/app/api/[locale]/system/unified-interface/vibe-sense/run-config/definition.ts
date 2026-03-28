/**
 * Vibe Sense - Run Config Definition
 * POST endpoint to execute a graph from an inline config (no DB save required)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { graphConfigSchema } from "../graph/schema";

import { RUN_CONFIG_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "run-config"],
  aliases: [RUN_CONFIG_ALIAS],
  title: "post.title",
  description: "post.description",
  icon: "play",
  category: "endpointCategories.analytics",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      config: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.fields.config.label",
        description: "post.fields.config.description",
        schema: graphConfigSchema,
      }),
      rangeFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeFrom.label",
        description: "post.fields.rangeFrom.description",
        schema: z.string().datetime(),
      }),
      rangeTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeTo.label",
        description: "post.fields.rangeTo.description",
        schema: z.string().datetime(),
      }),
      nodeCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.nodeCount",
        schema: z.number(),
      }),
      errorCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.errorCount",
        schema: z.number(),
      }),
      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.errors",
        schema: z.array(
          z.object({
            nodeId: z.string(),
            error: z.string(),
          }),
        ),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  examples: {
    requests: {
      default: {
        config: {
          nodes: {},
          edges: [],
          trigger: { type: "manual" },
        },
        rangeFrom: "2024-01-01T00:00:00Z",
        rangeTo: "2024-01-31T23:59:59Z",
      },
    },
    responses: {
      default: {
        nodeCount: 0,
        errorCount: 0,
        errors: [],
      },
    },
  },
});

export type RunConfigRequestInput = typeof POST.types.RequestInput;
export type RunConfigRequestOutput = typeof POST.types.RequestOutput;
export type RunConfigResponseInput = typeof POST.types.ResponseInput;
export type RunConfigResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
