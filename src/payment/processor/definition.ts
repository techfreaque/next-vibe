import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  CheckoutMode,
  PaymentProvider,
  PaymentProviderOptions,
  PaymentStatus,
  PaymentStatusOptions,
} from "../enum";
import {
  ProcessorKind,
  ProcessorKindOptions,
  ProcessorView,
  ProcessorViewOptions,
  RefundBlock,
  WebhookProcessing,
  WebhookProcessingOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

/** Calendar day in UTC, inclusive on both ends of a range. */
const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional();

const PaymentProcessorWidget = lazyWidget(() =>
  import("./widget").then((module) => ({
    default: module.PaymentProcessorWidget,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "processor"],
  aliases: ["payment-processor"],
  allowedRoles: [UserRole.ADMIN],
  category: "payments",
  subCategory: "Providers",
  icon: "receipt",
  title: "title",
  titleShort: "short",
  description: "description",
  tags: ["title", "response.transactions", "response.webhooks"],
  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PaymentProcessorWidget,
    children: {
      backButton: backButton(scopedTranslation, { usage: { response: true } }),
      view: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.view",
        options: ProcessorViewOptions,
        includeInCacheKey: true,
        schema: z.enum(ProcessorView).default(ProcessorView.TRANSACTIONS),
      }),
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.userId",
        hidden: true,
        includeInCacheKey: true,
        schema: z.uuid().optional(),
      }),
      transactionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.transactionId",
        hidden: true,
        includeInCacheKey: true,
        schema: z.uuid().optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.status",
        options: PaymentStatusOptions,
        includeInCacheKey: true,
        schema: z.enum(PaymentStatus).optional(),
      }),
      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.provider",
        options: PaymentProviderOptions,
        includeInCacheKey: true,
        schema: z.enum(PaymentProvider).optional(),
      }),
      kind: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.kind",
        options: ProcessorKindOptions,
        includeInCacheKey: true,
        schema: z.enum(ProcessorKind).optional(),
      }),
      currency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.currency",
        includeInCacheKey: true,
        schema: z.enum(CurrenciesArr).optional(),
      }),
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.from",
        description: "search.dayFormat",
        includeInCacheKey: true,
        schema: dayString,
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.to",
        description: "search.dayFormat",
        includeInCacheKey: true,
        schema: dayString,
      }),
      processing: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.processing",
        options: WebhookProcessingOptions,
        includeInCacheKey: true,
        schema: z.enum(WebhookProcessing).optional(),
      }),
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.query",
        includeInCacheKey: true,
        schema: z.string().trim().max(200).optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "search.page",
        includeInCacheKey: true,
        schema: z.coerce.number().int().min(1).max(1_000_000).default(1),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "search.limit",
        includeInCacheKey: true,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),
      transactions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.transactions",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.id",
              schema: z.uuid(),
            }),
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.userId",
              schema: z.uuid(),
            }),
            userEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.userEmail",
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.amount",
              schema: z.number(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.currency",
              schema: z.enum(CurrenciesArr),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.status",
              schema: z.enum(PaymentStatus),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.provider",
              schema: z.enum(PaymentProvider),
            }),
            mode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.mode",
              schema: z.enum(CheckoutMode),
            }),
            renewal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.renewal",
              schema: z.boolean(),
            }),
            kind: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.kind",
              schema: z.enum(ProcessorKind).nullable(),
            }),
            refundBlock: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.refundBlock",
              schema: z.enum(RefundBlock).nullable(),
            }),
            providerInvoiceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.providerInvoiceId",
              schema: z.string().nullable(),
            }),
            refundEligible: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.refundEligible",
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.createdAt",
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.updatedAt",
              schema: dateSchema,
            }),
          },
        }),
      }),
      webhooks: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.webhooks",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.eventId",
              schema: z.uuid(),
            }),
            providerEventId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.providerEventId",
              schema: z.string(),
            }),
            eventType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.eventType",
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.provider",
              schema: z.enum(PaymentProvider).nullable(),
            }),
            processed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.processed",
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "widget.received",
              schema: dateSchema,
            }),
            processedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.processedAt",
              schema: dateSchema.nullable(),
            }),
          },
        }),
      }),
      totals: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.totals",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.currency",
              schema: z.enum(CurrenciesArr),
            }),
            collected: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.collected",
              schema: z.number(),
            }),
            succeeded: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.succeeded",
              schema: z.number(),
            }),
            failed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.failed",
              schema: z.number(),
            }),
            refunded: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.refunded",
              schema: z.number(),
            }),
            refundedAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.refundedAmount",
              schema: z.number(),
            }),
            gross: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.gross",
              schema: z.number(),
            }),
          },
        }),
      }),
      resultView: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.view",
        schema: z.enum(ProcessorView),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.page",
        schema: z.number(),
      }),
      pageCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.pageCount",
        schema: z.number(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.total",
        schema: z.number(),
      }),
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.limit",
        schema: z.number(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errorTitles.unauthorized",
      description: "errors.unauthorized",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errorTitles.validation",
      description: "errors.validation",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errorTitles.forbidden",
      description: "errors.forbidden",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errorTitles.server",
      description: "errors.server",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errorTitles.unknown",
      description: "errors.unknown",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errorTitles.conflict",
      description: "errors.conflict",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errorTitles.network",
      description: "errors.network",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errorTitles.notFound",
      description: "errors.notFound",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errorTitles.unsavedChanges",
      description: "errors.unsavedChanges",
    },
  },
  successTypes: { title: "success", description: "successDescription" },
  examples: {
    requests: {
      default: { view: ProcessorView.TRANSACTIONS, page: 1, limit: 20 },
      failed: {
        view: ProcessorView.TRANSACTIONS,
        status: PaymentStatus.FAILED,
        page: 1,
        limit: 20,
      },
      webhooks: {
        view: ProcessorView.WEBHOOKS,
        processing: WebhookProcessing.UNPROCESSED,
        page: 1,
        limit: 20,
      },
      revenueDrill: {
        view: ProcessorView.TRANSACTIONS,
        status: PaymentStatus.SUCCEEDED,
        kind: ProcessorKind.RENEWAL,
        currency: "EUR",
        from: "2026-11-01",
        to: "2026-11-21",
        page: 1,
        limit: 20,
      },
    },
    responses: {
      empty: {
        resultView: ProcessorView.TRANSACTIONS,
        transactions: [],
        webhooks: [],
        totals: [],
        currentPage: 1,
        pageCount: 0,
        total: 0,
        pageSize: 20,
      },
      failed: {
        resultView: ProcessorView.TRANSACTIONS,
        transactions: [
          {
            id: "9dcfcdaa-6f32-4ea7-8180-4d662aaef27f",
            userId: "22cca261-5789-4d02-aa9c-26d1b6b986af",
            userEmail: "billing-test@example.com",
            amount: 29,
            currency: "EUR",
            status: PaymentStatus.FAILED,
            provider: PaymentProvider.STRIPE,
            mode: CheckoutMode.SUBSCRIPTION,
            renewal: true,
            kind: ProcessorKind.RENEWAL,
            providerInvoiceId: "in_audit_example",
            refundEligible: false,
            refundBlock: null,
            createdAt: "2026-11-19T09:30:00.000Z",
            updatedAt: "2026-11-19T09:30:02.000Z",
          },
        ],
        webhooks: [],
        totals: [
          {
            currency: "EUR",
            collected: 0,
            succeeded: 0,
            failed: 1,
            refunded: 0,
            refundedAmount: 0,
            gross: 0,
          },
        ],
        currentPage: 1,
        pageCount: 1,
        total: 1,
        pageSize: 20,
      },
      eligible: {
        resultView: ProcessorView.TRANSACTIONS,
        transactions: [
          {
            id: "d4f2b541-0f4e-4336-b037-ac7b8913b778",
            userId: "22cca261-5789-4d02-aa9c-26d1b6b986af",
            userEmail: "billing-test@example.com",
            amount: 29,
            currency: "EUR",
            status: PaymentStatus.SUCCEEDED,
            provider: PaymentProvider.STRIPE,
            mode: CheckoutMode.SUBSCRIPTION,
            renewal: true,
            kind: ProcessorKind.RENEWAL,
            providerInvoiceId: "in_audit_eligible",
            refundEligible: true,
            refundBlock: null,
            createdAt: "2026-11-12T09:30:00.000Z",
            updatedAt: "2026-11-12T09:30:00.000Z",
          },
        ],
        webhooks: [],
        totals: [
          {
            currency: "EUR",
            collected: 29,
            succeeded: 1,
            failed: 0,
            refunded: 0,
            refundedAmount: 0,
            gross: 0,
          },
        ],
        currentPage: 1,
        pageCount: 1,
        total: 1,
        pageSize: 20,
      },
      webhooks: {
        resultView: ProcessorView.WEBHOOKS,
        transactions: [],
        webhooks: [
          {
            id: "418687e8-5227-42a1-9045-47835144490d",
            providerEventId: "evt_auditExample",
            eventType: "invoice.payment_failed",
            provider: PaymentProvider.STRIPE,
            processed: false,
            createdAt: "2026-11-19T09:30:03.000Z",
            processedAt: null,
          },
        ],
        totals: [],
        currentPage: 1,
        pageCount: 1,
        total: 1,
        pageSize: 20,
      },
    },
  },
});

export type PaymentProcessorRequest = typeof GET.types.RequestOutput;
export type PaymentProcessorResponse = typeof GET.types.ResponseOutput;

export default { GET };
