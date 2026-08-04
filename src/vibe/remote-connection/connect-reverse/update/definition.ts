/**
 * Reverse Connection Update
 * PATCH — called by the initiating instance to mirror syncScope changes to the
 * other side. The remote updates its reverse entry's syncScope to match.
 * Cloud-only constraint: cloud cannot initiate; only local instances call this.
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "../../../unified-ui/_shared/utils-i18n";
import { SyncScopeSchema, TransportModeSchema } from "../../db";
import { scopedTranslation } from "./i18n";

const ReverseUpdateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ReverseConnectionUpdateWidget,
  })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["vibe", "remote-connection", "connect-reverse", "update"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "refresh-cw" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: ReverseUpdateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().min(1).max(32),
      }),
      syncScope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.syncScope.label" as const,
        description: "patch.syncScope.description" as const,
        // OPTIONAL — mirrored ONLY when the initiator actually changed scope. It
        // MUST stay undefined otherwise: SyncScopeSchema's per-field
        // .default(true) would fill an absent scope with ALL-TRUE, so a
        // transportMode-only mirror would clobber the peer's scope to all-on
        // (observed: reverse-update re-enabling every domain and re-syncing).
        schema: SyncScopeSchema.optional(),
      }),
      // How the peer reaches US (mirror of the peer's own transportMode). Sets
      // our row's remoteTransportMode and (re)opens/closes our connector.
      remoteTransportMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.syncScope.label" as const,
        description: "patch.syncScope.description" as const,
        schema: TransportModeSchema.optional(),
      }),
      // OUR own send leg toward the peer, mirrored from the peer's directly-set
      // remoteTransportMode (how it reaches us == our transportMode). Keeps both
      // rows' transport pair in lockstep when either side edits it directly.
      transportMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.syncScope.label" as const,
        description: "patch.syncScope.description" as const,
        schema: TransportModeSchema.optional(),
      }),
      // The caller renamed itself: update OUR label for it (row instanceId +
      // REMOTE subfolder + task targets). `instanceId` above still carries the
      // caller's OLD id — that is how the row is found.
      newInstanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.newInstanceId.label" as const,
        description: "patch.newInstanceId.description" as const,
        schema: z.string().min(1).max(32).optional(),
      }),
      // The caller wants US to restart our outbound connector to them (needed
      // when the peer's socket was the one that dropped and we hold no socket
      // to reconnect on our own).
      reconnectNow: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        schema: z.boolean().optional(),
        hidden: true,
      }),
      updated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
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
      default: {
        instanceId: "hermes",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: true,
        },
      },
    },
    responses: {
      default: {
        updated: true,
      },
    },
  },
});

export type ReverseUpdatePatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ReverseUpdatePatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
