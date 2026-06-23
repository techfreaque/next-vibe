/**
 * Remote Event Bridge — definition
 *
 * The generic runner for cross-instance remote events. It receives ANY route's
 * remoteEvent from a peer and dispatches it to that route's onRemoteEvent —
 * one event type, fully definition-driven. Two delivery paths, same code:
 *   - HTTP POST (direct-http peers call this endpoint directly)
 *   - onRemoteEvent in route.ts (reverse-WS peers send wire messages)
 *
 * There is no per-domain event: cache invalidation, chat stream relay, and
 * domain sync are all just remoteEvents on their own endpoints. Tool execution
 * is the one exception — it has its own endpoint (execute-tool).
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["remote-connection", "remote-event-bridge"],
  aliases: ["remote-event-bridge"],
  title: "remoteEventBridge.post.title" as const,
  titleShort: "remoteEventBridge.post.titleShort" as const,
  description: "remoteEventBridge.post.description" as const,
  icon: "radio",
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteSync" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      // ── Request fields ─────────────────────────────────────────────────────
      eventName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().min(1),
      }),
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().min(1),
      }),
      payload: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: WidgetDataSchema,
      }),

      // ── Response fields ────────────────────────────────────────────────────
      received: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),

      // ── Generic server-event payload fields ────────────────────────────────
      // One relay event carries ANY route's remoteEvent. These appear only in
      // the event payload, not in normal HTTP responses. The bridge dispatches
      // to the target route's onRemoteEvent — the route is the runner; the
      // payload shape is the target event's own definition fields.
      originInstanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      syncDomain: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      endpointPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.array(z.string()).optional(),
      }),
      endpointMethod: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      urlPathParams: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.record(z.string(), z.string()).optional(),
      }),
      endpointEventName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      endpointPayload: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: WidgetDataSchema.optional(),
      }),
    },
  }),

  // === EVENTS (server-side wire protocol) ===
  // ONE relay event. The bridge is a generic runner: it receives any route's
  // remoteEvent from a peer and dispatches it to that route's onRemoteEvent.
  // There is no per-domain event type — domain (cache, chat, skills, …) is just
  // the event's declared syncDomain, carried for per-connection
  // syncScope gating at the sender. No sync-event, no live-message-event.
  events: {
    "remote-event": {
      remoteEvent: true as const,
      clientDelivery: false as const,
      allowedRoles: [
        UserRole.CUSTOMER,
        UserRole.PARTNER_ADMIN,
        UserRole.PARTNER_EMPLOYEE,
        UserRole.ADMIN,
      ] as const,
      responseFields: [
        "originInstanceId",
        "syncDomain",
        "endpointPath",
        "endpointMethod",
        "urlPathParams",
        "endpointEventName",
        "endpointPayload",
      ] as const,
      operation: "merge" as const,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "remoteEventBridge.post.errors.validation.title" as const,
      description:
        "remoteEventBridge.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "remoteEventBridge.post.errors.unauthorized.title" as const,
      description:
        "remoteEventBridge.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "remoteEventBridge.post.errors.internal.title" as const,
      description:
        "remoteEventBridge.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "remoteEventBridge.post.errors.forbidden.title" as const,
      description:
        "remoteEventBridge.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "remoteEventBridge.post.errors.notFound.title" as const,
      description:
        "remoteEventBridge.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "remoteEventBridge.post.errors.network.title" as const,
      description: "remoteEventBridge.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "remoteEventBridge.post.errors.unknown.title" as const,
      description: "remoteEventBridge.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "remoteEventBridge.post.errors.unsaved.title" as const,
      description: "remoteEventBridge.post.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "remoteEventBridge.post.errors.conflict.title" as const,
      description:
        "remoteEventBridge.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "remoteEventBridge.post.success.title" as const,
    description: "remoteEventBridge.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        eventName: "remote-event",
        leadId: "lead-uuid-here",
        payload: {},
      },
    },
    responses: {
      default: {
        received: true,
      },
    },
  },
});

export const endpoints = { POST };

export type RemoteEventBridgeRequestOutput = typeof POST.types.RequestOutput;
export type RemoteEventBridgeResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
