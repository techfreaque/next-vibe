/**
 * Vibe Sense - Graph Edit (Branch) Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { graphConfigSchema } from "../../../graph/schema";

import React from "react";

import { scopedTranslation } from "./i18n";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const EditGraphWidget = React.lazy(() =>
  import("./widget").then((m) => ({ default: m.EditGraphWidget })),
);

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["system", "unified-interface", "vibe-sense", "graphs", "[id]", "edit"],
  title: "put.title",
  description: "put.description",
  icon: "edit",
  category: "endpointCategories.analytics",
  subCategory: "endpointCategories.analyticsVibeSense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: EditGraphWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "put.fields.id.label",
        description: "put.fields.id.description",
        hidden: true,
        schema: z.union([z.string().uuid(), z.literal("new")]).optional(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.name.label",
        description: "put.fields.name.description",
        schema: z.string().max(100).optional(),
      }),
      slug: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.slug.label",
        description: "put.fields.slug.description",
        schema: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/)
          .optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.description.label",
        description: "put.fields.description.description",
        schema: z.string().optional(),
      }),
      config: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "put.fields.config.label",
        description: "put.fields.config.description",
        schema: graphConfigSchema,
      }),
      newId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.newId",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "put.errors.unauthorized.title",
      description: "put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "put.errors.forbidden.title",
      description: "put.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "put.errors.server.title",
      description: "put.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "put.errors.unknown.title",
      description: "put.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "put.errors.validation.title",
      description: "put.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "put.errors.notFound.title",
      description: "put.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "put.errors.conflict.title",
      description: "put.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "put.errors.network.title",
      description: "put.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "put.errors.unsavedChanges.title",
      description: "put.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "put.success.title",
    description: "put.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        name: "Lead Funnel v2",
        config: {
          nodes: {},
          edges: [],
          trigger: { type: "cron", schedule: "0 6 * * *" },
        },
      },
    },
    responses: { default: { newId: "660e8400-e29b-41d4-a716-446655440001" } },
  },
});

const definitions = { PUT };
export default definitions;

export type GraphEditPutResponseOutput = typeof PUT.types.ResponseOutput;
