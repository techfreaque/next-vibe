/**
 * User Remote Connection API Definition
 * GET — returns current remote connection status (no token in response)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { RemoteConnectionWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "remote-connection"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "link" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: RemoteConnectionWidget,
    usage: { response: true },
    children: {
      isConnected: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      remoteUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      isActive: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().nullable(),
      }),
      lastSyncedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      instanceId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      friendlyName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
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
    responses: {
      connected: {
        isConnected: true,
        remoteUrl: "https://unbottled.ai",
        isActive: true,
        lastSyncedAt: "2026-03-01T12:00:00.000Z",
        instanceId: "hermes",
        friendlyName: "My Laptop",
      },
      notConnected: {
        isConnected: false,
        remoteUrl: null,
        isActive: null,
        lastSyncedAt: null,
        instanceId: null,
        friendlyName: null,
      },
    },
  },
});

export type RemoteConnectionGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
