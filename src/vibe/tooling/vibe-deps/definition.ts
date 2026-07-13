import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayOptionalField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { VIBE_DEPS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const VibeDepsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.VibeDepsWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "vibe-deps"],
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
          { value: "report", label: "mode.report" },
          { value: "files", label: "mode.files" },
          { value: "categories", label: "mode.categories" },
          { value: "unused", label: "mode.unused" },
          { value: "boundaries", label: "mode.boundaries" },
          { value: "layers", label: "mode.layers" },
          { value: "shared-candidates", label: "mode.sharedCandidates" },
          { value: "importers", label: "mode.importers" },
          { value: "needs-move", label: "mode.needsMove" },
          { value: "unused-symbols", label: "mode.unusedSymbols" },
          { value: "cross-domain", label: "mode.crossDomain" },
          { value: "page-violations", label: "mode.pageViolations" },
        ],
        schema: z
          .enum([
            "report",
            "files",
            "categories",
            "unused",
            "boundaries",
            "layers",
            "shared-candidates",
            "importers",
            "needs-move",
            "unused-symbols",
            "cross-domain",
            "page-violations",
          ])
          .default("report"),
      }),

      package: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.package.label",
        description: "fields.package.description",
        placeholder: "fields.package.placeholder",
        columns: 4,
        schema: z.string().optional(),
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
      view: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum([
          "report",
          "files",
          "categories",
          "unused",
          "boundaries",
          "layers",
          "shared-candidates",
          "importers",
          "needs-move",
          "unused-symbols",
          "cross-domain",
          "page-violations",
        ]),
      }),

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
            sourcePackage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            targetPackage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            violationKind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z
                .enum(["out-of-package", "cross-package", "reverse-direction"])
                .optional(),
            }),
            offenders: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.array(z.string()).optional(),
            }),
            moveTo: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            moveNote: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            moveKind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(["reorganize", "relocate"]).optional(),
            }),
            symbol: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            symbolKind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            symbolOwner: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      groups: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          layoutType: LayoutType.STACKED,
          columns: 12,
          children: {
            package: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            violationCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number(),
            }),
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
                  importedByCount: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.number(),
                  }),
                  violationKind: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z
                      .enum([
                        "out-of-package",
                        "cross-package",
                        "reverse-direction",
                      ])
                      .optional(),
                  }),
                  sourcePackage: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  targetPackage: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  offenders: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.array(z.string()).optional(),
                  }),
                  moveTo: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  moveNote: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  moveKind: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.enum(["reorganize", "relocate"]).optional(),
                  }),
                  symbol: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  symbolKind: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                  symbolOwner: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string().optional(),
                  }),
                },
              }),
            }),
          },
        }),
      }),

      violations: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        layoutType: LayoutType.STACKED,
        columns: 12,
        children: {
          outOfPackage: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.number(),
          }),
          crossPackage: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.number(),
          }),
          reverseDirection: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.number(),
          }),
        },
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
      boundaries: {
        mode: "boundaries" as const,
      },
      layers: {
        mode: "layers" as const,
      },
      sharedCandidates: {
        mode: "shared-candidates" as const,
      },
    },
    responses: {
      default: {
        view: "files" as const,
        entries: [],
        groups: [],
        violations: {
          outOfPackage: 0,
          crossPackage: 0,
          reverseDirection: 0,
          total: 0,
        },
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
