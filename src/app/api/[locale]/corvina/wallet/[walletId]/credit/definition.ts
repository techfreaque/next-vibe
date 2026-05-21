import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const WalletCreditContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletCreditContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "wallet", "[walletId]", "credit"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "wallet",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_credit"],

  fields: customWidgetObject({
    render: WalletCreditContainer,
    usage: { request: "data", response: true } as const,
    children: {
      walletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.walletId.label" as const,
        description: "post.walletId.description" as const,
        placeholder: "post.walletId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      orderId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orderId.label" as const,
        description: "post.orderId.description" as const,
        placeholder: "post.orderId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      ordinal: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.ordinal.label" as const,
        description: "post.ordinal.description" as const,
        placeholder: "post.ordinal.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      authorizedBy: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.authorizedBy.label" as const,
        description: "post.authorizedBy.description" as const,
        placeholder: "post.authorizedBy.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      amount: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.amount.label" as const,
        description: "post.amount.description" as const,
        placeholder: "post.amount.placeholder" as const,
        columns: 6,
        schema: z.coerce.number(),
      }),
      sourceOrgResourceId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sourceOrgResourceId.label" as const,
        description: "post.sourceOrgResourceId.description" as const,
        placeholder: "post.sourceOrgResourceId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      sourceWalletId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sourceWalletId.label" as const,
        description: "post.sourceWalletId.description" as const,
        placeholder: "post.sourceWalletId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      transferDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transferDescription.label" as const,
        description: "post.transferDescription.description" as const,
        placeholder: "post.transferDescription.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      transactionSubjectType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectType.label" as const,
        description: "post.transactionSubjectType.description" as const,
        placeholder: "post.transactionSubjectType.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectRef: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectRef.label" as const,
        description: "post.transactionSubjectRef.description" as const,
        placeholder: "post.transactionSubjectRef.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectQuantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.transactionSubjectQuantity.label" as const,
        description: "post.transactionSubjectQuantity.description" as const,
        placeholder: "post.transactionSubjectQuantity.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      nextRenewalDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.nextRenewalDate.label" as const,
        description: "post.nextRenewalDate.description" as const,
        placeholder: "post.nextRenewalDate.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      errorCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.errorCode" as const,
        schema: z.number().optional(),
      }),
      executionResult: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.executionResult" as const,
        schema: z.string(),
      }),
      failureReason: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.failureReason" as const,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.createdAt" as const,
        schema: dateSchema.nullable(),
      }),
      issuedBy: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.issuedBy" as const,
        schema: z.string().nullable(),
      }),
      targetWalletId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.targetWalletId" as const,
        schema: z.string().nullable(),
      }),
      txDescription: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.txDescription" as const,
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        walletId: "my-wallet-01",
        orderId: "order-12345",
        amount: 100,
        authorizedBy: "admin@example.com",
      },
    },
    responses: {
      default: {
        id: 1042,
        errorCode: undefined,
        executionResult: "SUCCESS",
        failureReason: null,
        createdAt: new Date("2026-05-12T10:00:00Z"),
        issuedBy: "system",
        targetWalletId: "my-wallet-01",
        txDescription: null,
        orderId: "order-12345",
        ordinal: undefined,
        authorizedBy: "admin@example.com",
        amount: 100,
        sourceOrgResourceId: undefined,
        sourceWalletId: undefined,
      },
    },
  },
});

export type WalletCreditRequestOutput = typeof POST.types.RequestOutput;
export type WalletCreditResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
