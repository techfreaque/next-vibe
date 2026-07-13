/**
 * Remote Connection Register API Definition
 * POST - called by a local instance to register itself on the cloud during connect flow.
 * The cloud stores the local instance info (instanceId + localUrl) so it knows
 * which local instances are connected per user.
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
import {
  customWidgetObject,
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { SyncScopeSchema, TransportModeSchema } from "../db";
import { scopedTranslation } from "./i18n";
const RemoteRegisterWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RemoteRegisterWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["remote-connection", "connect-reverse"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "server" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: RemoteRegisterWidget,
    usage: { request: "data", response: true } as const,
    children: {
      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.instanceId.label" as const,
        description: "post.instanceId.description" as const,
        placeholder: "post.instanceId.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1)
          .max(32)
          .regex(/^[a-z0-9-]+$/, {
            message: "post.instanceId.validation.invalid",
          }),
      }),
      localUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.localUrl.label" as const,
        description: "post.localUrl.description" as const,
        placeholder: "post.localUrl.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1, { message: "post.localUrl.validation.required" })
          .url({ message: "post.localUrl.validation.invalid" })
          .transform((val) => val.replace(/\/+$/, "")),
      }),
      reverseToken: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),
      reverseLeadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),
      // The connecting instance's OWN userId on its own DB. The cloud stores it
      // as the reverse entry's remoteUserId so the cloud's connector can target
      // the peer's concrete `user/{remoteUserId}` channel for the bridge event.
      selfUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        hidden: true,
        schema: z.string().optional(),
      }),
      // The initiator's sync scope — the reverse entry MIRRORS it so both sides
      // agree on which domains sync (kept in sync thereafter via
      // connect-reverse/update on every scope change). Required: the initiator
      // always sends its full scope.
      syncScope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        columns: 12,
        hidden: true,
        schema: SyncScopeSchema,
      }),
      // The initiator's OWN transport leg toward us (how the initiator reaches
      // this side). We store it as the reverse entry's `remoteTransportMode` —
      // it drives whether WE open an outbound connector (a reverse-ws initiator
      // means we subscribe to its hub). Optional for older initiators; the
      // column default (direct-http) applies when absent, kept in sync thereafter
      // via connect-reverse/update.
      remoteTransportMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        hidden: true,
        schema: TransportModeSchema.optional(),
      }),
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "post.title" as const,
        loadingText: "post.title" as const,
        icon: "server",
        variant: "default",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      registered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      remoteInstanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      // The cloud's OWN userId. The connecting instance stores it as its
      // connection's remoteUserId so ITS connector can target the cloud's
      // concrete `user/{remoteUserId}` channel for the bridge event.
      remoteUserId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
    },
  }),

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
      default: {
        instanceId: "hermes",
        localUrl: "http://localhost:3000",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: false,
        },
      },
    },
    responses: {
      default: {
        registered: true,
        remoteInstanceId: "thea",
        remoteUserId: "00000000-0000-0000-0000-000000000000",
      },
    },
  },
});

export type RemoteRegisterPostRequestInput = typeof POST.types.RequestInput;
export type RemoteRegisterPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
