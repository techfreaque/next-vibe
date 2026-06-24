/**
 * AP Bill Create Endpoint Definition
 * POST — record a new supplier bill (Accounts Payable)
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { BillStatus, BillStatusDB, BillStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const BillCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "bill", "create"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.ap" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: BillCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "companyId.label" as const,
        description: "companyId.description" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),

      supplierName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "supplierName.label" as const,
        description: "supplierName.description" as const,
        placeholder: "supplierName.placeholder" as const,
        columns: 8,
        schema: z.string().min(1).max(255),
      }),

      supplierVatNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "supplierVatNumber.label" as const,
        description: "supplierVatNumber.description" as const,
        placeholder: "supplierVatNumber.placeholder" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      billNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "billNumber.label" as const,
        description: "billNumber.description" as const,
        placeholder: "billNumber.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      billDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "billDate.label" as const,
        description: "billDate.description" as const,
        placeholder: "billDate.placeholder" as const,
        columns: 6,
        schema: dateSchema,
      }),

      dueDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "dueDate.label" as const,
        description: "dueDate.description" as const,
        placeholder: "dueDate.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
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

      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "notes.label" as const,
        description: "notes.description" as const,
        placeholder: "notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // RESPONSE FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.id" as const,
        schema: z.uuid(),
      }),

      companyIdResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.companyId" as const,
        schema: z.uuid(),
      }),

      supplierNameResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.supplierName" as const,
        schema: z.string(),
      }),

      billNumberResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.billNumber" as const,
        schema: z.string().nullable(),
      }),

      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: BillStatusOptions,
        schema: z.enum(BillStatusDB),
      }),

      subtotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.subtotal" as const,
        schema: z.number(),
      }),

      taxAmount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.taxAmount" as const,
        schema: z.number(),
      }),

      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.total" as const,
        schema: z.number(),
      }),

      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.createdAt" as const,
        schema: z.coerce.date(),
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
        companyId: "00000000-0000-0000-0000-000000000001",
        supplierName: "Acme GmbH",
        supplierVatNumber: "DE123456789",
        billNumber: "INV-2024-001",
        billDate: "2024-01-15T00:00:00Z",
        dueDate: "2024-02-15T00:00:00Z",
        currency: "EUR",
        notes: "Monthly services",
      },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        companyIdResponse: "00000000-0000-0000-0000-000000000001",
        supplierNameResponse: "Acme GmbH",
        billNumberResponse: "INV-2024-001",
        status: BillStatus.DRAFT,
        subtotal: 0,
        taxAmount: 0,
        total: 0,
        createdAt: new Date("2024-01-15T00:00:00.000Z"),
      },
    },
  },
});

export type BillCreateRequestInput = typeof POST.types.RequestInput;
export type BillCreateRequestOutput = typeof POST.types.RequestOutput;
export type BillCreateResponseInput = typeof POST.types.ResponseInput;
export type BillCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
