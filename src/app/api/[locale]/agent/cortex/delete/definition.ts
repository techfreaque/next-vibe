/**
 * Cortex Delete Definition
 * DELETE endpoint for removing files and directories
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

import { CORTEX_DELETE_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexDeleteWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexDeleteWidget })),
);

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "cortex", "delete"],
  aliases: [CORTEX_DELETE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  statusBadge: {
    loading: {
      label: "delete.status.loading" as const,
      color: "bg-red-500/10 text-red-500",
    },
    done: {
      label: "delete.status.done" as const,
      color: "bg-red-500/10 text-red-500",
    },
  },
  icon: "trash",
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "delete.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["delete.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexDeleteWidget,
    usage: { request: "data", response: true } as const,
    children: {
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.fields.path.label" as const,
        description: "delete.fields.path.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      recursive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "delete.fields.recursive.label" as const,
        description: "delete.fields.recursive.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      nodesDeleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "delete.response.nodesDeleted.text" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    requests: {
      deleteFile: { path: "/documents/notes/old.md" },
      deleteFolder: { path: "/documents/archive", recursive: true },
    },
    responses: {
      deleted: { responsePath: "/documents/notes/old.md", nodesDeleted: 1 },
      deletedFolder: { responsePath: "/documents/archive", nodesDeleted: 5 },
    },
  },
});

export type CortexDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { DELETE };
export default definitions;
