/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { envClient } from "@/config/env-client";
import { Environment } from "../../../shared/utils";
import { UserRole } from "../../../user/user-roles/enum";
import { VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT } from "./constants";
import { scopedTranslation } from "./i18n";

const CheckResultWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.CheckResultWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "check", "vibe-check"],
  title: "title",
  description: "description",
  category: "endpointCategories.systemDevTools",
  tags: ["tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    ...(envClient.NODE_ENV !== Environment.PRODUCTION
      ? [UserRole.MCP_VISIBLE]
      : []),
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: [VIBE_CHECK_ALIAS, VIBE_CHECK_ALIAS_SHORT],

  cli: {
    firstCliArgKey: "paths",
  },

  fields: customWidgetObject({
    render: CheckResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      fix: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.fix.label",
        description: "fields.fix.description",
        columns: 4,
        schema: z.boolean().optional(),
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
      default: {},
      specificPaths: {
        paths: ["src/components", "src/utils"],
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
