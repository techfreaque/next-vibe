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

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/realtime/remote-event-bridge/i18n";
import { objectField, requestField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import type { AnyEndpointEventEnvelope } from "../structured-events";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "realtime", "remote-event-bridge"],
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
    usage: { request: "data" } as const,
    children: {
      eventName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
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
          // Point-to-point address: shared hub channel reaches every peer
          // connector — only the addressed connection applies the frame.
          targetLeadId: z.string().optional(),
        }),
      }),
    },
  }),

  // === EVENTS ===
  // ONE transport event — a REGULAR scope:"user" client-delivered event, like any
  // other. The bridge is the generic runner: a peer's connector subscribes to THIS
  // endpoint's user-scoped channel (`user/{uid}/ws-…-remote-event-bridge-POST`) and
  // dispatches the carried envelope to the target route's onRemoteEvent
  // (connector.handleRemoteEvent → dispatchRemoteEvent). Only connectors subscribe
  // to that channel — browser tabs subscribe to the endpoints they render, so
  // bridge frames (incl. execution requests) never reach them.
  // It must NOT carry remoteEvent:true — that would make it re-enter the relay; it
  // is delivered locally to the subscribed connector, not re-relayed.
  //
  // The relay payload (originInstanceId/syncDomain/envelope) rides the event's own
  // requestData.payload, gated per connection by its syncScope (see
  // repository.pushRemoteEvent).
  channel: { scope: "user" } as const,
  events: {
    "remote-event": {
      allowedRoles: [
        UserRole.CUSTOMER,
        UserRole.PARTNER_ADMIN,
        UserRole.PARTNER_EMPLOYEE,
        UserRole.ADMIN,
      ] as const,
      requestFields: ["payload"] as const,
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
        payload: {},
      },
    },
  },
});

export const endpoints = { POST };

export type RemoteEventBridgeRequestOutput = typeof POST.types.RequestOutput;
export type RemoteEventBridgeResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
