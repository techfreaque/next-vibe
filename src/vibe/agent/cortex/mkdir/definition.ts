/**
 * Cortex Mkdir Definition
 * POST endpoint for creating directories
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CORTEX_MKDIR_ALIAS, resolveCortexIcon } from "../constants";
import { CortexViewTypeDB, CortexViewTypeOptions } from "../enum";
import { scopedTranslation } from "./i18n";

const CortexMkdirWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexMkdirWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "cortex", "mkdir"],
  aliases: [CORTEX_MKDIR_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "folder-plus",
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  statusBadge: {
    loading: {
      label: "post.status.loading" as const,
      color: "bg-amber-500/10 text-amber-500",
    },
    done: {
      label: "post.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "cortex",
  tags: ["post.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexMkdirWidget,
    usage: { request: "data", response: true } as const,
    children: {
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.path.label" as const,
        description: "post.fields.path.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      viewType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.viewType.label" as const,
        description: "post.fields.viewType.description" as const,
        columns: 6,
        options: CortexViewTypeOptions,
        schema: z.enum(CortexViewTypeDB).optional(),
      }),
      createParents: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.createParents.label" as const,
        description: "post.fields.createParents.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.created.text" as const,
        schema: z.boolean(),
      }),
    },
  }),

  // This op owns its `node-written` event. `requestFields` carry the mkdir the
  // user submitted; the peer's onRemoteEvent re-runs createDirectory. Server-only
  // — no client cache to update, so clientDelivery: false.
  events: {
    "node-written": {
      remoteEvent: true as const,
      clientDelivery: false as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: ["path", "viewType", "createParents"] as const,
      syncDomain: "documents" as const,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      simple: { path: "/documents/projects", createParents: true },
      kanban: {
        path: "/documents/tasks",
        viewType: CortexViewTypeDB[1], // kanban
        createParents: true,
      },
    },
    responses: {
      created: { responsePath: "/documents/projects", created: true },
    },
  },
});

export type CortexMkdirResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
