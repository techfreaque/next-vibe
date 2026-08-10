/**
 * Vibe Stage Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../unified-ui/_shared/utils";
import {
  requestField,
  responseArrayOptionalField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import { VIBE_STAGE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const VibeStageWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.VibeStageWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "vibe-stage"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "devTools",
  subCategory: "Check",
  tags: ["title"],
  icon: "git-branch",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
  ],
  aliases: [VIBE_STAGE_ALIAS],
  timeoutMs: 240000, // 4 minutes
  fields: customWidgetObject({
    render: VibeStageWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.label",
        description: "fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      paths: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "fields.paths.label",
        description: "fields.paths.description",
        placeholder: "fields.paths.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // === RESPONSE FIELDS ===
      staged: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      partiallyStaged: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      skipped: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      renamed: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      deleted: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        staged: ["src/products/catalog/list/route.ts"],
        partiallyStaged: ["src/products/catalog/list/definition.ts"],
        skipped: [],
        renamed: ["src/products/old/route.ts -> src/products/catalog/route.ts"],
        deleted: ["src/generated/tanstack/products/old/route.ts"],
      },
    },
  },
});

export type VibeStageRequestOutput = typeof POST.types.RequestOutput;
export type VibeStageResponseOutput = typeof POST.types.ResponseOutput;

const vibeStageEndpoints = { POST };
export default vibeStageEndpoints;
