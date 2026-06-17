/**
 * Record Manual Payment Endpoint
 * Records a manual payment against an invoice, marking it as PAID if fully settled
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import listDef0 from "@/app/api/[locale]/chart-of-accounts/account/list/definition";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { ManualPaymentMethod, ManualPaymentMethodOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";

const InvoiceRecordPaymentWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceRecordPaymentWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "record-payment"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "check-circle" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: InvoiceRecordPaymentWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        schema: z.uuid(),
        hidden: true,
      }),

      // REQUEST FIELDS
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "amount.label" as const,
        description: "amount.description" as const,
        placeholder: "amount.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().positive(),
      }),

      method: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "method.label" as const,
        description: "method.description" as const,
        placeholder: "method.placeholder" as const,
        options: ManualPaymentMethodOptions,
        columns: 6,
        schema: z.enum(ManualPaymentMethod),
      }),

      paidAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "paidAt.label" as const,
        description: "paidAt.description" as const,
        placeholder: "paidAt.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      accountNodeId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "accountNodeId.label" as const,
        description: "accountNodeId.description" as const,
        columns: 6,
        schema: z.uuid().optional(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string().nullable(),
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
    urlPathParams: {
      default: {
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        amount: 1476,
        method: ManualPaymentMethod.BANK_TRANSFER,
        paidAt: "2024-01-15T10:00:00Z",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type InvoiceRecordPaymentUrlPathParams =
  typeof POST.types.UrlVariablesOutput;
export type InvoiceRecordPaymentRequestInput = typeof POST.types.RequestInput;
export type InvoiceRecordPaymentRequestOutput = typeof POST.types.RequestOutput;
export type InvoiceRecordPaymentResponseInput = typeof POST.types.ResponseInput;
export type InvoiceRecordPaymentResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
