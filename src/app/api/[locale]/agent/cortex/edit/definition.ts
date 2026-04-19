/**
 * Cortex Edit Definition
 * PATCH endpoint for find-and-replace editing within a file
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

import { CORTEX_EDIT_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexEditWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexEditWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "cortex", "edit"],
  aliases: [CORTEX_EDIT_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "patch.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
  statusBadge: {
    loading: {
      label: "patch.status.loading" as const,
      color: "bg-amber-500/10 text-amber-500",
    },
    done: {
      label: "patch.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  icon: "pencil",
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["patch.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexEditWidget,
    usage: { request: "data", response: true } as const,
    children: {
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.path.label" as const,
        description: "patch.fields.path.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      find: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.fields.find.label" as const,
        description: "patch.fields.find.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      replace: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.fields.replace.label" as const,
        description: "patch.fields.replace.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      startLine: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.fields.startLine.label" as const,
        description: "patch.fields.startLine.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).optional(),
      }),
      endLine: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.fields.endLine.label" as const,
        description: "patch.fields.endLine.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).optional(),
      }),
      newContent: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.fields.newContent.label" as const,
        description: "patch.fields.newContent.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      size: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "patch.response.size.text" as const,
        schema: z.number(),
      }),
      replacements: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "patch.response.replacements.text" as const,
        schema: z.number(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.updatedAt.content" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      findReplace: {
        path: "/documents/notes/meeting.md",
        find: "TODO",
        replace: "DONE",
      },
      lineReplace: {
        path: "/documents/tasks/fix-auth.md",
        startLine: 3,
        endLine: 3,
        newContent: "status: done",
      },
    },
    responses: {
      edited: {
        responsePath: "/documents/notes/meeting.md",
        size: 120,
        replacements: 2,
        updatedAt: "2026-04-17T15:00:00Z",
      },
    },
  },
});

export type CortexEditResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH };
export default definitions;
