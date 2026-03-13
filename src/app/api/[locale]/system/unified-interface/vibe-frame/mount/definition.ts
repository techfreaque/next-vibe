/**
 * Vibe Frame Config — Endpoint Definition
 *
 * POST /api/[locale]/system/unified-interface/vibe-frame/mount
 *
 * Called by the embed script (always cross-origin) with identity provided in
 * the POST body. For each requested integration, mints a short-lived (30s)
 * single-use exchange token and returns a ready-to-use iframe URL.
 * No auth secrets appear in URLs for longer than 30 seconds.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataArrayField,
  requestField,
  responseArrayField,
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

import { scopedTranslation } from "./i18n";

// ─── Endpoint definition ──────────────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-frame", "mount"],
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "globe",
  category: "app.endpointCategories.systemDevTools",

  tags: [
    "tags.vibeFrame" as const,
    "tags.embed" as const,
    "tags.widget" as const,
    "tags.config" as const,
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,

  allowedLocalModeRoles: [] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.VERTICAL,
    title: "post.container.title" as const,
    description: "post.container.description" as const,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.leadId.label" as const,
        description: "post.fields.leadId.description" as const,
        columns: 6,
        schema: z.string().uuid().optional(),
      }),
      authToken: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.authToken.label" as const,
        description: "post.fields.authToken.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      integrations: requestDataArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fields.integrations.label" as const,
        description: "post.fields.integrations.description" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.VERTICAL,
          title: "post.fields.integration.label" as const,
          description: "post.fields.integration.description" as const,
          usage: { request: "data" } as const,
          children: {
            id: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.id.label" as const,
              description: "post.fields.id.description" as const,
              placeholder: "post.fields.id.placeholder" as const,
              columns: 6,
              schema: z.string().min(1),
            }),
            endpoint: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.endpoint.label" as const,
              description: "post.fields.endpoint.description" as const,
              placeholder: "post.fields.endpoint.placeholder" as const,
              columns: 6,
              schema: z.string().optional(),
            }),
            hasRendered: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "post.fields.hasRendered.label" as const,
              description: "post.fields.hasRendered.description" as const,
              columns: 3,
              schema: z.boolean().optional(),
            }),
            theme: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.theme.label" as const,
              description: "post.fields.theme.description" as const,
              columns: 3,
              schema: z
                .enum(["light", "dark", "system"])
                .optional()
                .default("system"),
            }),
            urlPathParams: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.urlPathParams.label" as const,
              description: "post.fields.urlPathParams.description" as const,
              placeholder: "post.fields.urlPathParams.placeholder" as const,
              columns: 6,
              schema: z.record(z.string(), z.string()).optional(),
            }),
            data: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.data.label" as const,
              description: "post.fields.data.description" as const,
              placeholder: "post.fields.data.placeholder" as const,
              columns: 6,
              schema: z.record(z.string(), z.string()).optional(),
            }),
            frameId: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.fields.frameId.label" as const,
              description: "post.fields.frameId.description" as const,
              columns: 6,
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      // === RESPONSE ===
      widgets: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fields.widgets.label" as const,
        description: "post.fields.widgets.description" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.VERTICAL,
          title: "post.fields.widget.label" as const,
          description: "post.fields.widget.description" as const,
          usage: { response: true } as const,
          children: {
            frameId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.frameId.label" as const,
              schema: z.string(),
            }),
            widgetUrl: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.widgetUrl.label" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title" as const,
      description: "post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title" as const,
      description: "post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.configured.title" as const,
    description: "post.success.configured.description" as const,
  },

  examples: {
    requests: {
      default: {
        integrations: [{ id: "contact_POST" }],
      },
      withOptions: {
        integrations: [
          { id: "contact_POST", theme: "dark" as const },
          {
            id: "search",
            endpoint: "agent_search_kagi_GET",
            hasRendered: true,
          },
        ],
      },
    },
    responses: {
      default: {
        widgets: [
          {
            frameId: "vf-abc123",
            widgetUrl:
              "https://unbottled.ai/en-US/frame/contact/POST?et=abc&frameId=vf-abc123",
          },
        ],
      },
    },
  },
});

// Extract types from definition (single source of truth)
export type VibeFrameConfigRequestOutput = typeof POST.types.RequestOutput;
export type VibeFrameConfigResponseOutput = typeof POST.types.ResponseOutput;
export type IntegrationRequest =
  VibeFrameConfigRequestOutput["integrations"][number];
export type WidgetResponse = VibeFrameConfigResponseOutput["widgets"][number];

const definitions = { POST } as const;
export default definitions;
