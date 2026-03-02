/**
 * Run Oxlint Endpoint Definition
 * Production-ready endpoint for run oxlint
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayOptionalFieldNew,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";
import { CheckResultWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "check", "oxlint"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.system",
  tags: ["tag"],
  icon: "shield",
  allowedRoles: [
    // intentionally disabled so AI can't call it and rather uses check
  ],
  aliases: ["oxlint", "l", "ox", "lint"],

  cli: {
    firstCliArgKey: "path",
  },

  fields: customWidgetObject({
    render: CheckResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "container.title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      path: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.path.label",
        description: "fields.path.description",
        placeholder: "fields.path.placeholder",
        columns: 6,
        schema: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .default("./"),
      }),

      fix: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.fix.label",
        description: "fields.fix.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      timeout: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.timeoutSeconds.label",
        description: "fields.timeoutSeconds.description",
        columns: 3,
        schema: z.coerce.number().min(1).max(3600).default(3600),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(200),
      }),

      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      skipSorting: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSorting.label",
        description: "fields.skipSorting.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      filter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.filter.label",
        description: "fields.filter.description",
        placeholder: "fields.filter.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      summaryOnly: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.summaryOnly.label",
        description: "fields.summaryOnly.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      items: scopedResponseArrayOptionalFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            line: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            column: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.coerce.number().optional(),
            }),
            rule: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            severity: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(["error", "warning", "info"]),
            }),
            message: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),

      files: scopedResponseArrayOptionalFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            file: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            errors: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            warnings: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            total: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
          },
        }),
      }),

      totalIssues: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalFiles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      totalErrors: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredIssues: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      filteredFiles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedIssues: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      displayedFiles: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      truncatedMessage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
      currentPage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
      totalPages: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().optional(),
      }),
    },
  }),

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
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: {
        fix: false,
        limit: 100,
        page: 1,
      },
      verbose: {
        fix: false,
        limit: 100,
        page: 1,
      },
      fix: {
        path: "src/app/api/[locale]/system/unified-interface/cli",
        fix: true,
        limit: 100,
        page: 1,
      },
    },
    responses: {
      default: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },
      verbose: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },
      fix: {
        items: [],
        files: [],
        totalIssues: 0,
        totalFiles: 0,
      },
    },
  },
});

// Export types following migration guide pattern
export type OxlintRequestInput = typeof POST.types.RequestInput;
export type OxlintRequestOutput = typeof POST.types.RequestOutput;
export type OxlintResponseInput = typeof POST.types.ResponseInput;
export type OxlintResponseOutput = typeof POST.types.ResponseOutput;

export type OxlintIssue = NonNullable<OxlintResponseOutput["items"]>[number];

const endpoints = { POST };
export default endpoints;
