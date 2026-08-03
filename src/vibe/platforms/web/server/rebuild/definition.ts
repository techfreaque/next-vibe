/**
 * Rebuild & Restart Endpoint Definition
 * Rebuilds the application and hot-restarts the running Next.js server
 */

import { translatedValueSchema } from "../../../../core/definition/common.schema";
import { createEndpoint } from "../../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../../../core/definition/enums";
import { UserRole } from "../../../../identity/roles/enum";
import { scopedTranslation } from "./i18n";
import { lazyWidget } from "../../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../../unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
} from "../../../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ServerFramework, ServerFrameworkOptions } from "../enum";
import { REBUILD_ALIAS } from "./constants";

const RebuildWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RebuildWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "platforms", "web", "server", "rebuild"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "serverManagement",
  tags: ["tags.rebuild"],
  icon: "refresh-cw",
  timeoutMs: 0,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
  ],
  // Local/dev mode only - generator includes ADMIN but constants.ts guards with LOCAL_MODE
  defaultWebPinned: [UserRole.ADMIN] as const,
  aliases: [REBUILD_ALIAS, "re"],

  fields: customWidgetObject({
    render: RebuildWidget,
    usage: { request: "data", response: true } as const,
    children: {
      framework: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.framework.title",
        description: "post.fields.framework.description",
        options: ServerFrameworkOptions,
        schema: z.enum(ServerFramework).default(ServerFramework.NEXT),
      }),

      webpack: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.webpack.title",
        description: "post.fields.webpack.description",
        schema: z.boolean().optional().default(true),
      }),

      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: translatedValueSchema,
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      steps: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: translatedValueSchema,
            }),
            ok: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
            skipped: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
            durationMs: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(z.string()).optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
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
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: { framework: ServerFramework.NEXT, webpack: true },
      tanstack: { framework: ServerFramework.TANSTACK },
      turbopack: { framework: ServerFramework.NEXT, webpack: false },
    },
    responses: {
      default: {
        success: "Rebuild Complete",
        duration: 107000,
        steps: [
          {
            label: "Code generation",
            ok: true,
            skipped: false,
            durationMs: 13000,
          },
          { label: "Vibe check", ok: true, skipped: false, durationMs: 11000 },
          {
            label: "Next.js build",
            ok: true,
            skipped: false,
            durationMs: 75000,
          },
          { label: "Migrations", ok: true, skipped: false, durationMs: 656 },
          { label: "Seeding", ok: true, skipped: false, durationMs: 858 },
          { label: "Restart", ok: true, skipped: false, durationMs: 0 },
        ],
      },
    },
  },
});

const rebuildDefinition = { POST };
export type RebuildRequestInput = typeof POST.types.RequestInput;
export type RebuildRequestOutput = typeof POST.types.RequestOutput;
export type RebuildResponseOutput = typeof POST.types.ResponseOutput;
export type RebuildStep = NonNullable<RebuildResponseOutput["steps"]>[number];
export default rebuildDefinition;
