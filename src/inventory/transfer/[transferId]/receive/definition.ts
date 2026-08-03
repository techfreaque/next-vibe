/**
 * Inventory Transfer Receive API Route Definition
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

const InventoryTransferReceiveWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryTransferReceiveWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "transfer", "[transferId]", "receive"],
  title: "transferReceive.post.title" as const,
  titleShort: "transferReceive.post.titleShort" as const,
  description: "transferReceive.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.receive" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "check-circle" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryTransferReceiveWidget,
    children: {
      transferId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferReceive.post.transferId.label" as const,
        description: "transferReceive.post.transferId.description" as const,
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
            label: "transferReceive.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferReceive.post.response.status" as const,
            schema: z.string(),
          }),
          completedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferReceive.post.response.completedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferReceive.post.errors.validation.title" as const,
      description:
        "transferReceive.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferReceive.post.errors.unauthorized.title" as const,
      description:
        "transferReceive.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferReceive.post.errors.forbidden.title" as const,
      description: "transferReceive.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferReceive.post.errors.conflict.title" as const,
      description: "transferReceive.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferReceive.post.errors.server.title" as const,
      description: "transferReceive.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferReceive.post.errors.unknown.title" as const,
      description: "transferReceive.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferReceive.post.errors.network.title" as const,
      description: "transferReceive.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferReceive.post.errors.notFound.title" as const,
      description: "transferReceive.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferReceive.post.errors.unsavedChanges.title" as const,
      description:
        "transferReceive.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferReceive.post.success.title" as const,
    description: "transferReceive.post.success.description" as const,
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
          status: "RECEIVED",
          completedAt: new Date("2024-01-02T12:00:00.000Z"),
        },
      },
    },
  },
});

export type InventoryTransferReceiveRequestOutput =
  typeof POST.types.RequestOutput;
export type InventoryTransferReceiveResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
