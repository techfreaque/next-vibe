/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { Environment } from "next-vibe/env/env-util";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tooling/check/vibe-check/i18n";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { envClient } from "@/config/env-client";

import { VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT } from "./constants";

const CheckResultWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CheckResultWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "tooling", "check", "vibe-check"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "devTools",
  subCategory: "Check",
  tags: ["tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    ...(envClient.NODE_ENV !== Environment.PRODUCTION
      ? [UserRole.MCP_VISIBLE]
      : []),
  ],
  aliases: [VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT],

  cli: {
    firstCliArgKey: "paths",
  },
  timeoutMs: 0,
  fields: customWidgetObject({
    render: CheckResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        label: "title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.timeoutSeconds.label",
        description: "fields.timeoutSeconds.description",
        columns: 4,
        schema: z.coerce.number().min(1).max(36000).optional(),
      }),

      paths: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "fields.paths.label",
        description: "fields.paths.description",
        placeholder: "fields.paths.placeholder",
        columns: 8,
        options: [
          { value: "src/", label: "fields.paths.options.src" },
          { value: "src/components", label: "fields.paths.options.components" },
          { value: "src/utils", label: "fields.paths.options.utils" },
          { value: "src/pages", label: "fields.paths.options.pages" },
          { value: "src/app", label: "fields.paths.options.app" },
        ],
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional(),
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      filter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.filter.label",
        description: "fields.filter.description",
        placeholder: "fields.filter.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      summaryOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.summaryOnly.label",
        description: "fields.summaryOnly.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      extensive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.extensive.label",
        description: "fields.extensive.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      restartLsp: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.restartLsp.label",
        description: "fields.restartLsp.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      // === RESPONSE FIELDS ===
      editorUriSchema: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),

      items: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            line: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            column: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            rule: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            severity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(["error", "warning", "info"]),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),

      files: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            errors: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            warnings: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
          },
        }),
      }),

      // Summary (flat)
      totalIssues: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalErrors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredIssues: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedIssues: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      truncatedMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
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
      default: { restartLsp: false },
      specificPaths: {
        paths: ["src/components", "src/utils"],
        restartLsp: false,
      },
    },
    responses: {
      default: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },

      specificPaths: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },
    },
  },
});

export type VibeCheckRequestInput = typeof POST.types.RequestInput;
export type VibeCheckRequestOutput = typeof POST.types.RequestOutput;
export type VibeCheckResponseInput = typeof POST.types.ResponseInput;
export type VibeCheckResponseOutput = typeof POST.types.ResponseOutput;

const vibeCheckEndpoints = { POST };
export default vibeCheckEndpoints;
