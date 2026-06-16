/**
 * SSH Connection Mounts Create Endpoint
 * POST — add a mount to a connection
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
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

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

const MountCreateWidget = lazyWidget(() =>
  import("../widget").then((m) => ({ default: m.MountCreateWidget })),
);

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "connections", "[id]", "mounts", "create"],
  aliases: ["ssh-mount-create"] as const,
  title: "create.title" as const,
  titleShort: "create.titleShort" as const,
  description: "create.description" as const,
  icon: "folder-plus",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: MountCreateWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: connectionsListDefinition.GET,
        labelField: "label",
        schema: z.string().uuid(),
        label: "create.fields.connectionId.label" as const,
        description: "create.fields.connectionId.description" as const,
      }),
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.path.label" as const,
        description: "create.fields.path.description" as const,
        placeholder: "create.fields.path.placeholder" as const,
        schema: z.string().min(1).startsWith("/"),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "create.fields.isDefault.label" as const,
        description: "create.fields.isDefault.description" as const,
        schema: z.boolean().default(false),
      }),
      mountId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.id.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "create.success.title" as const,
    description: "create.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "create.errors.validation.title" as const,
      description: "create.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "create.errors.unauthorized.title" as const,
      description: "create.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "create.errors.forbidden.title" as const,
      description: "create.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "create.errors.server.title" as const,
      description: "create.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "create.errors.notFound.title" as const,
      description: "create.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "create.errors.unknown.title" as const,
      description: "create.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "create.errors.unsavedChanges.title" as const,
      description: "create.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "create.errors.conflict.title" as const,
      description: "create.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "create.errors.network.title" as const,
      description: "create.errors.network.description" as const,
    },
  },

  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    requests: {
      default: {
        path: "/home/max/project",
        isDefault: true,
      },
    },
    responses: { default: { mountId: "mount-uuid-1" } },
  },
});

export type MountCreateRequestOutput = typeof POST.types.RequestOutput;
export type MountCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
