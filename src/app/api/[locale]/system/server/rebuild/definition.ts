/**
 * Rebuild & Restart Endpoint Definition
 * Rebuilds the application and hot-restarts the running Next.js server
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
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
import { ServerFramework, ServerFrameworkOptions } from "../enum";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { REBUILD_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const RebuildWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.RebuildWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "rebuild"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.server",
  subCategory: "endpointCategories.serverManagement",
  tags: ["tags.rebuild"],
  icon: "refresh-cw",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: [
    REBUILD_ALIAS,
    "rebuild-restart",
    "rebuild-server",
    "rebuild-and-restart",
  ],

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

      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
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
              schema: z.string(),
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
      default: { framework: ServerFramework.NEXT },
      tanstack: { framework: ServerFramework.TANSTACK },
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
