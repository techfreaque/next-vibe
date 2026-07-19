/**
 * Convert Estimate to Invoice Endpoint
 * Creates a draft invoice from an accepted estimate and marks estimate as CONVERTED
 */

import { createEndpoint } from "next-vibe/core/definition/create";
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const EstimateConvertToInvoiceWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.EstimateConvertToInvoiceWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "estimate", "[estimateId]", "convert-to-invoice"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-plus" as const,
  tags: [
    "tags.payment" as const,
    "tags.estimate" as const,
    "tags.invoice" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EstimateConvertToInvoiceWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      estimateId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "estimateId.label" as const,
        description: "estimateId.description" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "estimateNumber",
      }),

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

      invoiceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.invoiceId" as const,
        schema: z.string(),
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
      default: { estimateId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        success: true,
        message: null,
        invoiceId: "789e0123-e89b-12d3-a456-426614174001",
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type EstimateConvertToInvoiceUrlPathParams =
  typeof POST.types.UrlVariablesOutput;
export type EstimateConvertToInvoiceResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
