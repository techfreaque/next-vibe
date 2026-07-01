/**
 * Inventory Transfer Create API Route Definition
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
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const InventoryTransferCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InventoryTransferCreateWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["inventory", "transfer", "create"],
  title: "transferCreate.post.title" as const,
  titleShort: "transferCreate.post.titleShort" as const,
  description: "transferCreate.post.description" as const,
  category: "inventory" as const,
  subCategory: "Inventory: Transfers" as const,
  tags: [
    "tags.inventory" as const,
    "tags.transfer" as const,
    "tags.create" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "refresh-cw" as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    render: InventoryTransferCreateWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferCreate.post.companyId.label" as const,
        description: "transferCreate.post.companyId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),
      fromWarehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferCreate.post.fromWarehouseId.label" as const,
        description: "transferCreate.post.fromWarehouseId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/inventory/warehouse/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      toWarehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "transferCreate.post.toWarehouseId.label" as const,
        description: "transferCreate.post.toWarehouseId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/inventory/warehouse/list/definition")
          ).default.GET,
        labelField: "name",
      }),
      reference: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "transferCreate.post.reference.label" as const,
        description: "transferCreate.post.reference.description" as const,
        schema: z.string().max(100).optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "transferCreate.post.notes.label" as const,
        description: "transferCreate.post.notes.description" as const,
        schema: z.string().max(1000).optional(),
      }),
      items: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "transferCreate.post.items.label" as const,
        description: "transferCreate.post.items.description" as const,
        schema: z
          .array(
            z.object({
              productId: z.uuid(),
              quantityRequested: z.number().positive(),
            }),
          )
          .min(1),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCreate.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCreate.post.response.status" as const,
            schema: z.string(),
          }),
          reference: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCreate.post.response.reference" as const,
            schema: z.string().nullable(),
          }),
          fromWarehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCreate.post.response.fromWarehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          toWarehouseId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "transferCreate.post.response.toWarehouseId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          items: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "transferCreate.post.response.id" as const,
                  hidden: true,
                  schema: z.uuid(),
                }),
                productId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "transferCreate.post.response.fromWarehouseId" as const,
                  schema: z.uuid(),
                }),
                quantityRequested: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "transferCreate.post.response.status" as const,
                  schema: z.number(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "transferCreate.post.errors.validation.title" as const,
      description: "transferCreate.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "transferCreate.post.errors.unauthorized.title" as const,
      description:
        "transferCreate.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "transferCreate.post.errors.forbidden.title" as const,
      description: "transferCreate.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "transferCreate.post.errors.conflict.title" as const,
      description: "transferCreate.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "transferCreate.post.errors.server.title" as const,
      description: "transferCreate.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "transferCreate.post.errors.unknown.title" as const,
      description: "transferCreate.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "transferCreate.post.errors.network.title" as const,
      description: "transferCreate.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "transferCreate.post.errors.notFound.title" as const,
      description: "transferCreate.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "transferCreate.post.errors.unsavedChanges.title" as const,
      description:
        "transferCreate.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "transferCreate.post.success.title" as const,
    description: "transferCreate.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
        fromWarehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
        toWarehouseId: "aabbccdd-e89b-12d3-a456-426614174002",
        reference: "TR-2024-001",
        items: [
          {
            productId: "11223344-e89b-12d3-a456-426614174001",
            quantityRequested: 50,
          },
        ],
      },
    },
    responses: {
      default: {
        result: {
          id: "ddee1122-e89b-12d3-a456-426614174001",
          status: "DRAFT",
          reference: "TR-2024-001",
          fromWarehouseId: "aabbccdd-e89b-12d3-a456-426614174001",
          toWarehouseId: "aabbccdd-e89b-12d3-a456-426614174002",
          items: [
            {
              id: "eeff2233-e89b-12d3-a456-426614174001",
              productId: "11223344-e89b-12d3-a456-426614174001",
              quantityRequested: 50,
            },
          ],
        },
      },
    },
  },
});

export type InventoryTransferCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type InventoryTransferCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
} as const;
export default definitions;
