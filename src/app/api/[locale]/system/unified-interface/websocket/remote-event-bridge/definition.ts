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
import type { AnyEndpointEventEnvelope } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
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
        schema: z.object({
          originInstanceId: z.string().optional(),
          syncDomain: z.string().optional(),
          envelope: z.custom<AnyEndpointEventEnvelope>().optional(),
        }),
      }),

      // ── Response fields ────────────────────────────────────────────────────
      received: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),

      // ── Generic server-event payload fields ────────────────────────────────
      // One relay event. The bridge dispatches to the target route's onRemoteEvent.
      // All 4 event fields travel together inside the envelope — not split here.
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
      envelope: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.custom<AnyEndpointEventEnvelope>().optional(),
      }),
    },
  }),

  // === EVENTS (server-side wire protocol) ===
  // ONE relay event — a wire-protocol DESCRIPTOR, not a dispatchable remoteEvent.
  // The bridge IS the generic runner: it receives any route's remoteEvent from a
  // peer (HTTP receive() or connector.handleRemoteEvent) and dispatches it to
  // that route's own onRemoteEvent via dispatchRemoteEvent. It must NOT carry
  // remoteEvent:true itself — that would make it re-enter the relay and require
  // its own onRemoteEvent handler. The event exists only to document the wire
  // frame the connector listens for on system/sync/{userId}.
  //
  // The relay payload is the RemoteEventWirePayload — carried in the envelope's
  // `payload` field. originInstanceId/syncDomain/envelope describe its shape.
  events: {
    "remote-event": {
      clientDelivery: false as const,
      allowedRoles: [
        UserRole.CUSTOMER,
        UserRole.PARTNER_ADMIN,
        UserRole.PARTNER_EMPLOYEE,
        UserRole.ADMIN,
      ] as const,
      responseFields: ["originInstanceId", "syncDomain", "envelope"] as const,
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
