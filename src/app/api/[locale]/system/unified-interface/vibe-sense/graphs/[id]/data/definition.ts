/**
 * Vibe Sense — Graph Detail + Data Definition
 *
 * GET  — Graph detail view (chart workspace with toolbar, indicator toggles)
 * POST — Fetch time-series data for the graph (on-demand execution)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { graphConfigSchema } from "../../../graph/schema";

import { scopedTranslation } from "./i18n";
import { GraphChartView } from "./widget";

// ─── GET — Graph Detail (Chart View) ────────────────────────────────────────

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "vibe-sense", "graphs", "[id]", "data"],
  title: "get.title",
  description: "get.description",
  icon: "bar-chart-2",
  category: "app.endpointCategories.system",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GraphChartView,
    usage: { request: "urlPathParams", response: true } as const,
    noFormElement: true,
    children: {
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.fields.id.label",
        description: "get.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      graph: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.id",
            schema: z.string(),
          }),
          slug: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.slug",
            schema: z.string(),
          }),
          name: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.name",
            schema: z.string(),
          }),
          description: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.description",
            schema: z.string().nullable(),
          }),
          ownerType: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.ownerType",
            schema: z.string(),
          }),
          isActive: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            content: "get.response.graph.isActive",
            schema: z.boolean(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.createdAt",
            schema: z.string(),
          }),
          config: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.config",
            schema: graphConfigSchema,
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        graph: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          slug: "lead-funnel",
          name: "Lead Funnel",
          description: null,
          ownerType: "system",
          isActive: true,
          createdAt: "2026-01-01T00:00:00Z",
          config: { nodes: {}, edges: [], trigger: { type: "manual" } },
        },
      },
    },
  },
});

// ─── POST — Graph Data ───────────────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "graphs", "[id]", "data"],
  title: "post.title",
  description: "post.description",
  icon: "bar-chart-2",
  category: "app.endpointCategories.system",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GraphChartView,
    usage: { request: "data&urlPathParams", response: true } as const,
    noFormElement: true,
    children: {
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.fields.id.label",
        description: "post.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      rangeFrom: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeFrom.label",
        description: "post.fields.rangeFrom.description",
        hidden: true,
        schema: z.string().datetime(),
      }),
      rangeTo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.rangeTo.label",
        description: "post.fields.rangeTo.description",
        hidden: true,
        schema: z.string().datetime(),
      }),
      series: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.series.nodeId",
              schema: z.string(),
            }),
            points: scopedResponseArrayFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: scopedObjectFieldNew(scopedTranslation, {
                type: WidgetType.CONTAINER,
                usage: { response: true },
                children: {
                  timestamp: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "post.response.series.points.timestamp",
                    schema: z.string(),
                  }),
                  value: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "post.response.series.points.value",
                    schema: z.number(),
                  }),
                },
              }),
            }),
          },
        }),
      }),
      signals: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.signals.nodeId",
              schema: z.string(),
            }),
            events: scopedResponseArrayFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: scopedObjectFieldNew(scopedTranslation, {
                type: WidgetType.CONTAINER,
                usage: { response: true },
                children: {
                  timestamp: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "post.response.signals.events.timestamp",
                    schema: z.string(),
                  }),
                  fired: scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    content: "post.response.signals.events.fired",
                    schema: z.boolean(),
                  }),
                },
              }),
            }),
          },
        }),
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
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        rangeFrom: "2024-01-01T00:00:00Z",
        rangeTo: "2024-01-31T23:59:59Z",
      },
    },
    responses: { default: { series: [], signals: [] } },
  },
});

const definitions = { GET, POST };
export default definitions;
