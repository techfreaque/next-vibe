/**
 * SSH Connection Mounts List Endpoint
 * GET — list all mounts for a connection
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import connectionsListDefinition from "../../../list/definition";
import { scopedTranslation } from "../i18n";

const MountsListWidget = lazyWidget(() =>
  import("../widget").then((m) => ({ default: m.MountsListWidget })),
);

export const MountItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  path: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "[id]", "mounts", "list"],
  aliases: ["ssh-mount-list"] as const,
  title: "list.title" as const,
  titleShort: "list.titleShort" as const,
  description: "list.description" as const,
  icon: "folder-open",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: MountsListWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: connectionsListDefinition.GET,
        labelField: "label",
        schema: z.string().uuid(),
        label: "list.fields.connectionId.label" as const,
        description: "list.fields.connectionId.description" as const,
      }),
      mounts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list.response.mounts.title" as const,
        schema: z.array(MountItemSchema),
      }),
    },
  }),

  successTypes: {
    title: "list.success.title" as const,
    description: "list.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list.errors.validation.title" as const,
      description: "list.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list.errors.unauthorized.title" as const,
      description: "list.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list.errors.forbidden.title" as const,
      description: "list.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list.errors.server.title" as const,
      description: "list.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list.errors.notFound.title" as const,
      description: "list.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list.errors.unknown.title" as const,
      description: "list.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list.errors.unsavedChanges.title" as const,
      description: "list.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list.errors.conflict.title" as const,
      description: "list.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list.errors.network.title" as const,
      description: "list.errors.network.description" as const,
    },
  },

  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    requests: undefined,
    responses: {
      default: {
        mounts: [
          {
            id: "mount-uuid-1",
            name: "project",
            path: "/home/max/project",
            isDefault: true,
            createdAt: "2026-01-01T00:00:00Z",
          },
          {
            id: "mount-uuid-2",
            name: "logs",
            path: "/var/log",
            isDefault: false,
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
      },
    },
  },
});

export type MountsListRequestOutput = typeof GET.types.RequestOutput;
export type MountsListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
