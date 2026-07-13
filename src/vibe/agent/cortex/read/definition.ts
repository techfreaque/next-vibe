/**
 * Cortex Read Definition
 * GET endpoint for reading file content from the virtual filesystem
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { CORTEX_READ_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexReadWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexReadWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "cortex", "read"],
  aliases: [CORTEX_READ_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
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
  icon: "file-text",
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  category: "cortex",
  tags: ["get.tags.cortex" as const],
  cli: {
    firstCliArgKey: "path",
  },
  defaultExpanded: true,

  fields: customWidgetObject({
    render: CortexReadWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label" as const,
        description: "get.fields.path.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      maxLines: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxLines.label" as const,
        description: "get.fields.maxLines.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(10000).optional(),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.content.content" as const,
        schema: z.string(),
      }),
      size: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.size.text" as const,
        schema: z.number(),
      }),
      truncated: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.truncated.text" as const,
        schema: z.boolean(),
      }),
      readonly: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.readonly.text" as const,
        schema: z.boolean(),
      }),
      nodeType: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.nodeType.text" as const,
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.updatedAt.content" as const,
        schema: dateSchema,
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
      readDocument: { path: "/documents/notes/meeting.md" },
      readThread: { path: "/threads/private/auth-redesign.md" },
      readMemory: { path: "/memories/3" },
    },
    responses: {
      document: {
        responsePath: "/documents/notes/meeting.md",
        content: "# Team Meeting\n\nDiscussed Cortex architecture.",
        size: 45,
        truncated: false,
        readonly: false,
        nodeType: "file",
        updatedAt: "2026-04-17T14:30:00Z",
      },
    },
  },
});

export type CortexReadResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
