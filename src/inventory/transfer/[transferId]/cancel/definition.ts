/**
 * Inventory Transfer Cancel API Route Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
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
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const InventoryTransferCancelWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryTransferCancelWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "transfer", "[transferId]", "cancel"],
  title: "transferCancel.post.title" as const,
  titleShort: "transferCancel.post.titleShort" as const,
  description: "transferCancel.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.cancel" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "x-circle" as const,

  fields: customWidgetObject({
    usage: { request: "urlPathParams", response: true } as const,
    render: InventoryTransferCancelWidget,
    children: {
      transferId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferCancel.post.transferId.label" as const,
        description: "transferCancel.post.transferId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/inventory/transfer/list/definition")).default.GET,
        labelField: "reference",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCancel.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCancel.post.response.status" as const,
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferCancel.post.errors.validation.title" as const,
      description: "transferCancel.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferCancel.post.errors.unauthorized.title" as const,
      description:
        "transferCancel.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferCancel.post.errors.forbidden.title" as const,
      description: "transferCancel.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferCancel.post.errors.conflict.title" as const,
      description: "transferCancel.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferCancel.post.errors.server.title" as const,
      description: "transferCancel.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferCancel.post.errors.unknown.title" as const,
      description: "transferCancel.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferCancel.post.errors.network.title" as const,
      description: "transferCancel.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferCancel.post.errors.notFound.title" as const,
      description: "transferCancel.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferCancel.post.errors.unsavedChanges.title" as const,
      description:
        "transferCancel.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferCancel.post.success.title" as const,
    description: "transferCancel.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        transferId: "ddee1122-e89b-12d3-a456-426614174001",
      },
    },
    responses: {
      default: {
        result: {
          id: "ddee1122-e89b-12d3-a456-426614174001",
          status: "CANCELLED",
        },
      },
    },
  },
});

export type InventoryTransferCancelRequestOutput =
  typeof POST.types.UrlVariablesOutput;
export type InventoryTransferCancelResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
