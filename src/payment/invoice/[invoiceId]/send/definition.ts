/**
 * Send Invoice Endpoint
 * Transitions a draft invoice to Open (sent) status
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
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { invoiceMailStatusSchema } from "./delivery-state";
import { scopedTranslation } from "./i18n";

const InvoiceSendWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceSendWidget })),
);

const errorTypes = {
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
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "send"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "send" as const,
  tags: ["tags.payment" as const, "tags.invoice" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { refreshInvoiceDocuments } =
          await import("@/finance/document-cache");
        await refreshInvoiceDocuments(data.logger, data.pathParams.invoiceId);
      },
    },
  },

  fields: customWidgetObject({
    render: InvoiceSendWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "invoiceId.label" as const,
        description: "invoiceId.description" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
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

      viewUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.viewUrl" as const,
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes,

  examples: {
    urlPathParams: {
      default: {
        invoiceId: "456e7890-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        viewUrl:
          "https://example.com/en/invoice/456e7890-e89b-12d3-a456-426614174000?token=abc123",
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

const InvoiceShareWidget = lazyWidget(() =>
  import("./widget").then(({ InvoiceShareWidget: Widget }) => ({
    default: Widget,
  })),
);
const InvoiceEmailWidget = lazyWidget(() =>
  import("./widget").then(({ InvoiceEmailWidget: Widget }) => ({
    default: Widget,
  })),
);

const deliveryRoute = {
  scopedTranslation,
  path: ["payment", "invoice", "[invoiceId]", "send"],
  category: "payments",
  subCategory: "Transactions",
  icon: "send",
  tags: ["tags.payment", "tags.invoice"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.SKILL_OFF,
  ],
  errorTypes,
  successTypes: {
    title: "delivery.share",
    description: "delivery.description",
  },
} as const;
const invoiceId = requestUrlPathParamsField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  label: "invoiceId.label",
  schema: z.uuid(),
  listEndpoint: async () => (await import("../../list/definition")).default.GET,
  labelField: "invoiceSequenceNumber",
});
const deliveryStatus = responseField(scopedTranslation, {
  type: WidgetType.TEXT,
  label: "delivery.status",
  schema: invoiceMailStatusSchema,
});
const deliveryExampleId = "456e7890-e89b-42d3-a456-426614174000";

const { GET } = createEndpoint({
  ...deliveryRoute,
  method: Methods.GET,
  aliases: ["invoice-share"],
  title: "delivery.share",
  titleShort: "delivery.share",
  description: "delivery.description",
  options: { formOptions: { autoSubmit: true, persistForm: false } },
  fields: customWidgetObject({
    render: InvoiceShareWidget,
    usage: { request: "urlPathParams", response: true },
    children: {
      invoiceId,
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.uuid(),
        hidden: true,
      }),
      number: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "invoiceId.label",
        schema: z.string(),
      }),
      viewUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "widget.viewUrl",
        schema: z.url(),
      }),
      recipient: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "delivery.recipient",
        schema: z.email().nullable(),
      }),
      deliveryStatus,
    },
  }),
  examples: {
    urlPathParams: { default: { invoiceId: deliveryExampleId } },
    responses: {
      default: {
        id: deliveryExampleId,
        number: "INV-42",
        viewUrl: `https://example.com/invoice/${deliveryExampleId}?token=fixture`,
        recipient: "buyer@example.invalid",
        deliveryStatus: "ready",
      },
    },
  },
});

const { PATCH } = createEndpoint({
  ...deliveryRoute,
  method: Methods.PATCH,
  aliases: ["invoice-email"],
  title: "delivery.send",
  titleShort: "delivery.send",
  description: "delivery.confirmDescription",
  options: {
    formOptions: { persistForm: false },
    mutationOptions: {
      onSuccess: async ({ logger, pathParams }) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, logger, {
          urlPathParams: pathParams,
        });
      },
    },
  },
  fields: customWidgetObject({
    render: InvoiceEmailWidget,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      invoiceId,
      expectedRecipient: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "delivery.recipient",
        schema: z.email(),
      }),
      deliveryStatus,
    },
  }),
  examples: {
    urlPathParams: { default: { invoiceId: deliveryExampleId } },
    requests: { default: { expectedRecipient: "buyer@example.invalid" } },
    responses: { default: { deliveryStatus: "accepted" } },
  },
});

export type InvoiceSendUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type InvoiceSendRequestInput = typeof POST.types.RequestInput;
export type InvoiceSendRequestOutput = typeof POST.types.RequestOutput;
export type InvoiceSendResponseInput = typeof POST.types.ResponseInput;
export type InvoiceSendResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { GET, POST, PATCH };
export default endpoints;
