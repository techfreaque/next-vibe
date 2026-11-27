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

import { scopedTranslation } from "../../../document-delivery/i18n";

const DeliveryLogWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceDeliveryLogWidget })),
);
const DeliverySendWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceDeliverEmailWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
} as const;

const deliveryRecordSchema = z.object({
  id: z.uuid(),
  documentType: z.enum(["invoice", "credit_note", "estimate"]),
  documentId: z.uuid(),
  documentNumber: z.string(),
  recipientEmail: z.string(),
  senderEmail: z.string(),
  subject: z.string(),
  attachmentFilename: z.string().nullable(),
  status: z.enum(["sent", "failed"]),
  messageId: z.string().nullable(),
  errorMessage: z.string().nullable(),
  isResend: z.boolean(),
  sentAt: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "invoice", "[invoiceId]", "deliver"],
  aliases: ["invoice-delivery-log"],
  title: "deliver.logTitle" as const,
  titleShort: "deliver.logTitle" as const,
  description: "deliver.logDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "mail" as const,
  tags: ["tags.payment" as const, "tags.email" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: DeliveryLogWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.invoiceId" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
      }),
      documentNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "pdf.documentNumber" as const,
        schema: z.string(),
      }),
      defaultRecipientEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deliver.recipientEmail" as const,
        schema: z.string().nullable(),
      }),
      defaultRecipientName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "deliver.recipientName" as const,
        schema: z.string().nullable(),
      }),
      deliveries: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.deliveries" as const,
        schema: z.array(deliveryRecordSchema),
      }),
    },
  }),
  errorTypes,
  examples: {
    urlPathParams: {
      default: { invoiceId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        documentNumber: "INV-2026-0001",
        defaultRecipientEmail: "buyer@example.com",
        defaultRecipientName: "ACME GmbH",
        deliveries: [],
      },
    },
  },
  successTypes: {
    title: "deliver.logSuccess" as const,
    description: "deliver.logDescription" as const,
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "[invoiceId]", "deliver"],
  aliases: ["invoice-deliver-email"],
  title: "deliver.sendTitle" as const,
  titleShort: "deliver.sendTitle" as const,
  description: "deliver.sendDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "send" as const,
  tags: ["tags.payment" as const, "tags.email" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  options: {
    mutationOptions: {
      onSuccess: async (ctx) => {
        const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
        await apiClient.refetchEndpoint(GET, ctx.logger, {
          urlPathParams: { invoiceId: ctx.pathParams.invoiceId },
        });
      },
    },
  },
  fields: customWidgetObject({
    render: DeliverySendWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      invoiceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.invoiceId" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "invoiceSequenceNumber",
      }),
      documentType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.documentType" as const,
        hidden: true,
        schema: z.enum(["invoice", "credit_note", "estimate"]).optional(),
      }),
      recipientEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "deliver.recipientEmail" as const,
        schema: z.email(),
      }),
      recipientName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "deliver.recipientName" as const,
        schema: z.string().max(200).optional(),
      }),
      customMessage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "deliver.customMessage" as const,
        schema: z.string().max(2000).optional(),
      }),
      isResend: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "deliver.isResend" as const,
        schema: z.boolean().default(false),
      }),
      delivery: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.deliveryId" as const,
        schema: deliveryRecordSchema,
      }),
    },
  }),
  errorTypes,
  examples: {
    urlPathParams: {
      default: { invoiceId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        recipientEmail: "buyer@example.com",
        recipientName: "ACME GmbH",
        isResend: false,
      },
    },
    responses: {
      default: {
        delivery: {
          id: "00000000-0000-4000-8000-000000000001",
          documentType: "invoice",
          documentId: "456e7890-e89b-12d3-a456-426614174000",
          documentNumber: "INV-2026-0001",
          recipientEmail: "buyer@example.com",
          senderEmail: "hi@unbottled.ai",
          subject: "Invoice INV-2026-0001",
          attachmentFilename: "INV-2026-0001.pdf",
          status: "sent",
          messageId: "<msg-1@example.com>",
          errorMessage: null,
          isResend: false,
          sentAt: "2026-11-26T12:00:00Z",
        },
      },
    },
  },
  successTypes: {
    title: "deliver.sendSuccess" as const,
    description: "deliver.sendDescription" as const,
  },
});

export type InvoiceDeliveryLogResponse = typeof GET.types.ResponseOutput;
export type InvoiceDeliverEmailRequest = typeof POST.types.RequestOutput;
export type InvoiceDeliverEmailResponse = typeof POST.types.ResponseOutput;
export type InvoiceDeliverPath = typeof POST.types.UrlVariablesOutput;

export default { GET, POST };
