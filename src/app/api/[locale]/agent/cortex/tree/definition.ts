/**
 * Cortex Tree Definition
 * GET endpoint for rendering a compact directory tree
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CORTEX_TREE_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexTreeWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexTreeWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "cortex", "tree"],
  aliases: [CORTEX_TREE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "folder-tree",
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  statusBadge: {
    loading: {
      label: "get.status.loading" as const,
      color: "bg-blue-500/10 text-blue-500",
    },
    done: {
      label: "get.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["get.tags.cortex" as const],
  defaultExpanded: true,

  fields: customWidgetObject({
    render: CortexTreeWidget,
    usage: { request: "data", response: true } as const,
    children: {
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label" as const,
        description: "get.fields.path.description" as const,
        columns: 12,
        schema: z.string().optional().default("/"),
      }),
      depth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.depth.label" as const,
        description: "get.fields.depth.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(10).optional().default(5),
      }),

      // === RESPONSE ===
      tree: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.tree.content" as const,
        schema: z.string(),
      }),
      totalFiles: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.totalFiles.text" as const,
        schema: z.number(),
      }),
      totalDirs: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.totalDirs.text" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      fullTree: { path: "/" },
      documentsOnly: { path: "/documents", depth: 3 },
    },
    responses: {
      tree: {
        tree: "/\n├── documents/\n│   ├── notes/\n│   │   └── meeting.md\n│   └── tasks/\n│       └── fix-auth.md\n├── threads/private/ (12 threads)\n├── memories/ (8 files)\n└── skills/ (3 skills)",
        totalFiles: 2,
        totalDirs: 3,
      },
    },
  },
});

export type CortexTreeResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
