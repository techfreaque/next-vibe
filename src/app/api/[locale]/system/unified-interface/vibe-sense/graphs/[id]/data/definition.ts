/**
 * Vibe Sense — Graph Detail + Data Definition
 *
 * GET  — Graph detail view: metadata + time-series data
 *         Resolution controls bucket size; cursor enables backwards pagination.
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
import { GraphResolution, GraphResolutionDB } from "../../../enum";

import { scopedTranslation } from "./i18n";
import { GraphChartView } from "./widget";

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
    usage: { request: "data&urlPathParams", response: true } as const,
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
      resolution: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.resolution.label",
        description: "get.fields.resolution.description",
        hidden: true,
        schema: z.enum(GraphResolutionDB).default(GraphResolution.ONE_DAY),
      }),
      cursor: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.cursor.label",
        description: "get.fields.cursor.description",
        hidden: true,
        schema: z.string().optional(),
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
      series: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.series.nodeId",
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
                    content: "get.response.series.timestamp",
                    schema: z.string(),
                  }),
                  value: scopedResponseField(scopedTranslation, {
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
      signals: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            nodeId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.signals.nodeId",
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
                    content: "get.response.signals.timestamp",
                    schema: z.string(),
                  }),
                  fired: scopedResponseField(scopedTranslation, {
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
          ownerType: "system",
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
