import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
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

import { UserRole } from "../../../user/user-roles/enum";
import { VIBE_DEPS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const VibeDepsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VibeDepsWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "check", "vibe-deps"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "devTools",
  subCategory: "Check",
  tags: ["tag"],
  icon: "git-branch",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_VISIBLE,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: [VIBE_DEPS_ALIAS],

  cli: {
    firstCliArgKey: "focus",
  },

  fields: customWidgetObject({
    render: VibeDepsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      focus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.focus.label",
        description: "fields.focus.description",
        placeholder: "fields.focus.placeholder",
        columns: 8,
        schema: z.string().optional(),
      }),

      mode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.mode.label",
        description: "fields.mode.description",
        columns: 4,
        options: [
          { value: "files", label: "mode.files" },
          { value: "categories", label: "mode.categories" },
          { value: "unused", label: "mode.unused" },
        ],
        schema: z.enum(["files", "categories", "unused"]).default("files"),
      }),

      depth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.depth.label",
        description: "fields.depth.description",
        columns: 4,
        schema: z.coerce.number().min(0).max(10).optional().default(1),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).max(10000).optional().default(100),
      }),

      // === RESPONSE FIELDS ===
      entries: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            path: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            imports: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.array(z.string()),
            }),
            importedBy: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.array(z.string()),
            }),
            importCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            importedByCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
            isUnused: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
          },
        }),
      }),

      totalFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),

      totalEdges: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),

      unusedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
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
      focusAgent: {
        focus: "agent",
        mode: "categories" as const,
        depth: 1,
      },
      unusedFiles: {
        mode: "unused" as const,
      },
    },
    responses: {
      default: {
        entries: [],
        totalFiles: 0,
        totalEdges: 0,
        unusedCount: 0,
      },
    },
  },
});

export type VibeDepsRequestInput = typeof POST.types.RequestInput;
export type VibeDepsRequestOutput = typeof POST.types.RequestOutput;
export type VibeDepsResponseInput = typeof POST.types.ResponseInput;
export type VibeDepsResponseOutput = typeof POST.types.ResponseOutput;

const vibeDepsEndpoints = { POST };
export default vibeDepsEndpoints;
