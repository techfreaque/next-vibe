/**
 * Inventory Transfer Dispatch API Route Definition
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const InventoryTransferDispatchWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryTransferDispatchWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "transfer", "[transferId]", "dispatch"],
  title: "transferDispatch.post.title" as const,
  titleShort: "transferDispatch.post.titleShort" as const,
  description: "transferDispatch.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.dispatch" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "send" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryTransferDispatchWidget,
    children: {
      transferId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferDispatch.post.transferId.label" as const,
        description: "transferDispatch.post.transferId.description" as const,
        schema: z.uuid(),
        urlPathParam: true,
        listEndpoint: async () =>
          (await import("@/inventory/transfer/list/definition")).default.GET,
        labelField: "id",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferDispatch.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferDispatch.post.response.status" as const,
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferDispatch.post.errors.validation.title" as const,
      description:
        "transferDispatch.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferDispatch.post.errors.unauthorized.title" as const,
      description:
        "transferDispatch.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferDispatch.post.errors.forbidden.title" as const,
      description:
        "transferDispatch.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferDispatch.post.errors.conflict.title" as const,
      description: "transferDispatch.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferDispatch.post.errors.server.title" as const,
      description: "transferDispatch.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferDispatch.post.errors.unknown.title" as const,
      description: "transferDispatch.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferDispatch.post.errors.network.title" as const,
      description: "transferDispatch.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferDispatch.post.errors.notFound.title" as const,
      description: "transferDispatch.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferDispatch.post.errors.unsavedChanges.title" as const,
      description:
        "transferDispatch.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferDispatch.post.success.title" as const,
    description: "transferDispatch.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        transferId: "ddee1122-e89b-12d3-a456-426614174001",
      },
    },
    responses: {
      default: {
        result: {
          id: "ddee1122-e89b-12d3-a456-426614174001",
          status: "IN_TRANSIT",
        },
      },
    },
  },
});

export type InventoryTransferDispatchRequestOutput =
  typeof POST.types.RequestOutput;
export type InventoryTransferDispatchResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
