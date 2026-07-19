/**
 * Cortex Terminals Definition
 * GET endpoint for listing active terminal sessions.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CORTEX_TERMINALS_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexTerminalsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexTerminalsWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "cortex", "terminals"],
  aliases: [CORTEX_TERMINALS_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  cli: { firstCliArgKey: "path" },

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
  icon: "terminal",
  category: "cortex",
  tags: ["get.tags.cortex" as const],
  defaultExpanded: true,

  fields: customWidgetObject({
    render: CortexTerminalsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label" as const,
        description: "get.fields.path.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE ===
      terminals: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            terminalId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.terminalId.content" as const,
              schema: z.string(),
            }),
            connectionSlug: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.connectionSlug.content" as const,
              schema: z.string(),
            }),
            cwd: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.cwd.content" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.name.content" as const,
              schema: z.string(),
            }),
            openedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.openedAt.content" as const,
              schema: dateSchema,
            }),
            lastCommandAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.terminals.lastCommandAt.content" as const,
              schema: dateSchema,
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.terminals.status.content" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.total.text" as const,
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
      all: {},
      filtered: { path: "/ssh/local-machine" },
    },
    responses: {
      active: {
        terminals: [
          {
            terminalId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            connectionSlug: "local-machine",
            cwd: "/home/user/projects",
            name: "",
            openedAt: "2026-06-01T10:00:00Z",
            lastCommandAt: "2026-06-01T10:05:00Z",
            status: "ACTIVE",
          },
        ],
        total: 1,
      },
    },
  },
});

export type CortexTerminalsRequestOutput = typeof GET.types.RequestOutput;
export type CortexTerminalsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
