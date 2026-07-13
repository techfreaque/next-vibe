/**
 * Vibe Sense - Graph Detail + Data Definition
 *
 * GET  - Graph detail view: metadata + time-series data
 *         Resolution controls bucket size; cursor enables backwards pagination.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  GraphOwnerType,
  GraphResolution,
  GraphResolutionDB,
} from "next-vibe/dataflow/enum";
import { graphConfigSchema } from "next-vibe/dataflow/graph/schema";
import { scopedTranslation } from "next-vibe/dataflow/graphs/[id]/data/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import React from "react";
import { z } from "zod";

// Lazy import to avoid TDZ circular dependency in MCP context
// (widget.tsx type-imports definition → circular module resolution → "Cannot access 'default' before initialization")
const GraphChartView = React.lazy(() =>
  import("./widget").then((m) => ({
    default: m.GraphChartView,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "dataflow", "graphs", "[id]", "data"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "bar-chart-2",
  category: "analytics",
  subCategory: "Vibe Sense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GraphChartView,
    usage: { request: "data&urlPathParams", response: true } as const,
    noFormElement: true,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("next-vibe/dataflow/graphs/definition")).default.GET,
        labelField: "name",
        label: "get.fields.id.label",
        description: "get.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      resolution: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.resolution.label",
        description: "get.fields.resolution.description",
        hidden: true,
        includeInCacheKey: true,
        schema: z.enum(GraphResolutionDB).default(GraphResolution.ONE_DAY),
      }),
      cursor: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.cursor.label",
        description: "get.fields.cursor.description",
        hidden: true,
        includeInCacheKey: true,
        schema: z.string().optional(),
      }),
      graph: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.id",
            schema: z.string(),
          }),
          slug: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.slug",
            schema: z.string(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.name",
            schema: z.string(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.description",
            schema: z.string().nullable(),
          }),
          ownerType: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.ownerType",
            schema: z.string(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            content: "get.response.graph.isActive",
            schema: z.boolean(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.createdAt",
            schema: dateSchema,
          }),
          config: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.graph.config",
            schema: graphConfigSchema,
          }),
        },
      }),
      series: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.series.nodeId",
              schema: z.string(),
            }),
            points: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: objectField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                usage: { response: true },
                children: {
                  timestamp: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.series.timestamp",
                    schema: dateSchema,
                  }),
                  value: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.series.value",
                    schema: z.number(),
                  }),
                },
              }),
            }),
          },
        }),
      }),
      signals: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.signals.nodeId",
              schema: z.string(),
            }),
            events: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: objectField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                usage: { response: true },
                children: {
                  timestamp: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.signals.timestamp",
                    schema: dateSchema,
                  }),
                  fired: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.signals.fired",
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
    requests: {
      default: {
        resolution: GraphResolution.ONE_DAY,
      },
    },
    responses: {
      default: {
        graph: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          slug: "lead-funnel",
          name: "Lead Funnel",
          description: null,
          ownerType: GraphOwnerType.SYSTEM,
          isActive: true,
          createdAt: "2026-01-01T00:00:00Z",
          config: { nodes: {}, edges: [], trigger: { type: "manual" } },
        },
        series: [],
        signals: [],
      },
    },
  },
});

const definitions = { GET };
export default definitions;
