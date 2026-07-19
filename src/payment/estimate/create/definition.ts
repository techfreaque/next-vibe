/**
 * Create Estimate Endpoint
 * Creates a new sales estimate/quote in DRAFT status with line items
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
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
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const EstimateCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EstimateCreateWidget })),
);

const lineSchema = z.object({
  description: z.string().min(1).max(500),
  productId: z.string().uuid().optional(),
  quantity: z.coerce.number().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
  taxRate: z.coerce.number().min(0).max(1).default(0),
  sortOrder: z.coerce.number().int().default(0),
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "estimate", "create"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-plus" as const,
  tags: ["tags.payment" as const, "tags.estimate" as const, "tags.ar" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EstimateCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        columns: 12,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      customerId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "customerId.label" as const,
        description: "customerId.description" as const,
        columns: 6,
        schema: z.uuid().optional(),
        listEndpoint: async () =>
          (await import("@/users/list/definition")).default.GET,
        labelField: "privateName",
      }),

      customerEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "customerEmail.label" as const,
        description: "customerEmail.description" as const,
        placeholder: "customerEmail.placeholder" as const,
        columns: 6,
        schema: z.email().optional(),
      }),

      customerName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "customerName.label" as const,
        description: "customerName.description" as const,
        placeholder: "customerName.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional(),
      }),

      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "currency.label" as const,
        description: "currency.description" as const,
        placeholder: "currency.placeholder" as const,
        columns: 6,
        schema: z.string().min(3).max(3).default("EUR"),
      }),

      validUntil: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "validUntil.label" as const,
        description: "validUntil.description" as const,
        placeholder: "validUntil.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "title.label" as const,
        description: "title.description" as const,
        placeholder: "title.placeholder" as const,
        columns: 12,
        schema: z.string().max(300).optional(),
      }),

      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "notes.label" as const,
        description: "notes.description" as const,
        placeholder: "notes.placeholder" as const,
        columns: 12,
        schema: z.string().max(2000).optional(),
      }),

      terms: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "terms.label" as const,
        description: "terms.description" as const,
        placeholder: "terms.placeholder" as const,
        columns: 12,
        schema: z.string().max(2000).optional(),
      }),

      lines: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "lines.label" as const,
        description: "lines.description" as const,
        columns: 12,
        schema: z.array(lineSchema).default([]),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message" as const,
        schema: z.string().nullable(),
      }),

      estimate: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.estimate.title" as const,
        description: "post.response.estimate.subtitle" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.id" as const,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.companyId" as const,
            schema: z.uuid(),
          }),
          estimateNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.estimateNumber" as const,
            schema: z.string(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.status" as const,
            schema: z.string(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.currency" as const,
            schema: z.string(),
          }),
          subtotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.subtotal" as const,
            schema: z.number(),
          }),
          taxAmount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.taxAmount" as const,
            schema: z.number(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.total" as const,
            schema: z.number(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.estimate.updatedAt" as const,
            schema: dateSchema,
          }),
        },
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

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        currency: "EUR",
        title: "Website Redesign Estimate",
        validUntil: "2024-03-01",
        notes: "Prices valid for 30 days",
        lines: [
          {
            description: "Web development - 40 hours",
            quantity: 40,
            unitPrice: 120,
            taxRate: 0.23,
          },
        ],
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        estimate: {
          id: "789e0123-e89b-12d3-a456-426614174000",
          companyId: "00000000-0000-0000-0000-000000000001",
          estimateNumber: "EST-2024-0001",
          status: "DRAFT",
          currency: "EUR",
          subtotal: 4800,
          taxAmount: 1104,
          total: 5904,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type EstimateCreateRequestInput = typeof POST.types.RequestInput;
export type EstimateCreateRequestOutput = typeof POST.types.RequestOutput;
export type EstimateCreateResponseInput = typeof POST.types.ResponseInput;
export type EstimateCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
