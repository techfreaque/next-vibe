/**
 * Vibe Sense — Graphs List + Create Endpoint Definitions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { graphConfigSchema } from "../graph/schema";
import {
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { GraphListContainer } from "./widget";

// ─── Graph List (GET) ────────────────────────────────────────────────────────

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "vibe-sense", "graphs"],
  title: "list.title",
  description: "list.description",
  icon: "git-branch",
  category: "app.endpointCategories.system",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: GraphListContainer,
    usage: { response: true } as const,
    children: {
      graphs: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.id",
              schema: z.string(),
            }),
            slug: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.slug",
              schema: z.string(),
            }),
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.name",
              schema: z.string(),
            }),
            description: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.description",
              schema: z.string().nullable(),
            }),
            ownerType: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.ownerType",
              schema: z.string(),
            }),
            ownerId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.ownerId",
              schema: z.string().nullable(),
            }),
            isActive: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "list.response.graph.isActive",
              schema: z.boolean(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list.response.graph.createdAt",
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list.errors.unauthorized.title",
      description: "list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list.errors.forbidden.title",
      description: "list.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list.errors.server.title",
      description: "list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list.errors.unknown.title",
      description: "list.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list.errors.validation.title",
      description: "list.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list.errors.notFound.title",
      description: "list.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list.errors.conflict.title",
      description: "list.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list.errors.network.title",
      description: "list.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list.errors.unsavedChanges.title",
      description: "list.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "list.success.title",
    description: "list.success.description",
  },
  examples: { responses: { default: { graphs: [] } } },
});

// ─── Graph Create (POST) ─────────────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "graphs"],
  title: "create.title",
  description: "create.description",
  icon: "plus",
  category: "app.endpointCategories.system",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.name.label",
        description: "create.fields.name.description",
        placeholder: "create.fields.name.placeholder",
        schema: z.string().min(1).max(100),
      }),
      slug: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.slug.label",
        description: "create.fields.slug.description",
        placeholder: "create.fields.slug.placeholder",
        schema: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/),
      }),
      description: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.description.label",
        description: "create.fields.description.description",
        placeholder: "create.fields.description.placeholder",
        schema: z.string().optional(),
      }),
      config: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "create.fields.config.label",
        description: "create.fields.config.description",
        hidden: true,
        schema: graphConfigSchema.optional(),
      }),
      id: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.id",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "create.errors.unauthorized.title",
      description: "create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "create.errors.forbidden.title",
      description: "create.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "create.errors.server.title",
      description: "create.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "create.errors.unknown.title",
      description: "create.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "create.errors.validation.title",
      description: "create.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "create.errors.notFound.title",
      description: "create.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "create.errors.conflict.title",
      description: "create.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "create.errors.network.title",
      description: "create.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "create.errors.unsavedChanges.title",
      description: "create.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "create.success.title",
    description: "create.success.description",
  },
  examples: {
    requests: {
      default: {
        name: "Lead Funnel",
        slug: "lead-funnel",
        config: {
          nodes: {},
          edges: [],
          trigger: { type: "cron", schedule: "0 6 * * *" },
        },
      },
    },
    responses: { default: { id: "550e8400-e29b-41d4-a716-446655440000" } },
  },
});

// ─── Exports ─────────────────────────────────────────────────────────────────

const definitions = {
  GET,
  POST,
};
export default definitions;
