/**
 * AP Bill Get Endpoint Definition
 * GET — retrieve a single bill with all line items
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { BillStatus, BillStatusDB, BillStatusOptions } from "../../../enum";
import listDef0 from "../../list/definition";
import { scopedTranslation } from "./i18n";

const BillGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "bill", "[billId]", "get"],
  aliases: ["payment-bill-get"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-text" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.ap" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: BillGetWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      billId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "get.billId.label" as const,
        description: "get.billId.description" as const,
        schema: z.uuid(),
        listEndpoint: listDef0.GET,
        labelField: "billNumber",
      }),

      // RESPONSE FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        hidden: true,
        schema: z.uuid(),
      }),
      companyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.companyId" as const,
        hidden: true,
        schema: z.uuid(),
      }),
      supplierName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.supplierName" as const,
        schema: z.string(),
      }),
      supplierVatNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.supplierVatNumber" as const,
        schema: z.string().nullable(),
      }),
      billNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.billNumber" as const,
        schema: z.string().nullable(),
      }),
      billDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.billDate" as const,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date(),
      }),
      dueDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.dueDate" as const,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date().nullable(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currency" as const,
        schema: z.string(),
      }),
      subtotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.subtotal" as const,
        schema: z.number(),
      }),
      taxAmount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.taxAmount" as const,
        schema: z.number(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.number(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: BillStatusOptions,
        schema: z.enum(BillStatusDB),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.notes" as const,
        schema: z.string().nullable(),
      }),
      journalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.journalEntryId" as const,
        schema: z.uuid().nullable(),
      }),
      paidAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.paidAt" as const,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.createdAt" as const,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.updatedAt" as const,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date(),
      }),
      lines: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.lineId" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.lineDescription" as const,
              schema: z.string(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.quantity" as const,
              schema: z.number(),
            }),
            unitPrice: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.unitPrice" as const,
              schema: z.number(),
            }),
            taxRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.taxRate" as const,
              schema: z.number(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.lineTaxAmount" as const,
              schema: z.number(),
            }),
            lineTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.lineTotal" as const,
              schema: z.number(),
            }),
          },
        }),
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
    urlPathParams: {
      default: { billId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        companyId: "00000000-0000-0000-0000-000000000001",
        supplierName: "Acme GmbH",
        supplierVatNumber: "DE123456789",
        billNumber: "INV-2024-001",
        billDate: new Date("2024-01-15T00:00:00.000Z"),
        dueDate: new Date("2024-02-15T00:00:00.000Z"),
        currency: "EUR",
        subtotal: 1000,
        taxAmount: 190,
        total: 1190,
        status: BillStatus.DRAFT,
        notes: null,
        journalEntryId: null,
        paidAt: null,
        createdAt: new Date("2024-01-15T00:00:00.000Z"),
        updatedAt: new Date("2024-01-15T00:00:00.000Z"),
        lines: [
          {
            id: "789e0123-e89b-12d3-a456-426614174000",
            description: "Software licenses Q1",
            quantity: 1,
            unitPrice: 1000,
            taxRate: 0.19,
            taxAmount: 190,
            lineTotal: 1190,
          },
        ],
      },
    },
  },
});

export type BillGetUrlPathParams = typeof GET.types.UrlVariablesOutput;
export type BillGetResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
