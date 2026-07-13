/**
 * Purchase Order Create API Route Definition
 * POST — create a new purchase order in Draft status
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
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const OrderCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrderCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "order", "create"],
  title: "orderCreate.post.title" as const,
  titleShort: "orderCreate.post.titleShort" as const,
  description: "orderCreate.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Orders",
  icon: "file-text" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.order" as const,
    "tags.create" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: OrderCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "orderCreate.companyId.label" as const,
        description: "orderCreate.companyId.description" as const,
        placeholder: "orderCreate.companyId.placeholder" as const,
        schema: z.uuid(),
      }),
      vendorId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/purchasing/vendor/list/definition")).default.GET,
        labelField: "name",
        label: "orderCreate.vendorId.label" as const,
        description: "orderCreate.vendorId.description" as const,
        placeholder: "orderCreate.vendorId.placeholder" as const,
        schema: z.uuid(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderCreate.currency.label" as const,
        description: "orderCreate.currency.description" as const,
        placeholder: "orderCreate.currency.placeholder" as const,
        columns: 4,
        schema: z.string().min(3).max(3).default("EUR"),
      }),
      expectedDeliveryDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "orderCreate.expectedDeliveryDate.label" as const,
        description: "orderCreate.expectedDeliveryDate.description" as const,
        placeholder: "orderCreate.expectedDeliveryDate.placeholder" as const,
        columns: 4,
        schema: z.coerce.date().optional(),
      }),
      deliveryWarehouseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "orderCreate.deliveryWarehouseId.label" as const,
        description: "orderCreate.deliveryWarehouseId.description" as const,
        placeholder: "orderCreate.deliveryWarehouseId.placeholder" as const,
        columns: 4,
        schema: z.uuid().optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "orderCreate.notes.label" as const,
        description: "orderCreate.notes.description" as const,
        placeholder: "orderCreate.notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          poNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.poNumber" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.status" as const,
            schema: z.string(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.subtotal" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.taxAmount" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.total" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.number(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "orderCreate.post.response.createdAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "orderCreate.post.errors.validation.title" as const,
      description: "orderCreate.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "orderCreate.post.errors.unauthorized.title" as const,
      description: "orderCreate.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "orderCreate.post.errors.forbidden.title" as const,
      description: "orderCreate.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "orderCreate.post.errors.conflict.title" as const,
      description: "orderCreate.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "orderCreate.post.errors.server.title" as const,
      description: "orderCreate.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "orderCreate.post.errors.unknown.title" as const,
      description: "orderCreate.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "orderCreate.post.errors.network.title" as const,
      description: "orderCreate.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "orderCreate.post.errors.notFound.title" as const,
      description: "orderCreate.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "orderCreate.post.errors.unsavedChanges.title" as const,
      description:
        "orderCreate.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "orderCreate.post.success.title" as const,
    description: "orderCreate.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
        vendorId: "456e7890-e89b-12d3-a456-426614174000",
        currency: "EUR",
        expectedDeliveryDate: undefined,
        deliveryWarehouseId: undefined,
        notes: undefined,
      },
    },
    responses: {
      default: {
        result: {
          id: "789e1234-e89b-12d3-a456-426614174000",
          poNumber: "PO-2024-0001",
          status: "DRAFT",
          subtotal: 0,
          taxAmount: 0,
          total: 0,
          createdAt: new Date("2024-06-01"),
        },
      },
    },
  },
});

export type OrderCreateRequestOutput = typeof POST.types.RequestOutput;
export type OrderCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
