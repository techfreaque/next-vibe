import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
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

const PreauthorizedTransactionCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionCreateContainer,
  })),
);

const preauthorizedTransactionResponseChildren = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.id" as const,
    schema: z.number().nullable(),
  }),
  orderId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.orderId" as const,
    schema: z.string(),
  }),
  ordinal: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.ordinal" as const,
    schema: z.number().nullable(),
  }),
  authorizedBy: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.authorizedBy" as const,
    schema: z.string().nullable(),
  }),
  targetWalletId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.targetWalletId" as const,
    schema: z.string(),
  }),
  amount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.amount" as const,
    schema: z.number(),
  }),
  sourceOrgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.sourceOrgResourceId" as const,
    schema: z.string().nullable(),
  }),
  sourceWalletId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.sourceWalletId" as const,
    schema: z.string().nullable(),
  }),
  description: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.description" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectType: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.transactionSubjectType" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectRef: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.transactionSubjectRef" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectQuantity: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.transactionSubjectQuantity" as const,
    schema: z.number().nullable(),
  }),
  executionMinTime: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.executionMinTime" as const,
    schema: dateSchema.nullable(),
  }),
  executionMaxTime: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.executionMaxTime" as const,
    schema: dateSchema.nullable(),
  }),
  updatedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.updatedAt" as const,
    schema: dateSchema.nullable(),
  }),
  revokedBy: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.revokedBy" as const,
    schema: z.string().nullable(),
  }),
  executionMaxOrdinal: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.executionMaxOrdinal" as const,
    schema: z.number().nullable(),
  }),
  state: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.state" as const,
    schema: z.string().nullable(),
  }),
  orgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.orgResourceId" as const,
    schema: z.string().nullable(),
  }),
  expectedPaymentsToDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.expectedPaymentsToDate" as const,
    schema: z.number().nullable(),
  }),
  actualPaymentsReceived: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.actualPaymentsReceived" as const,
    schema: z.number().nullable(),
  }),
  nextPaymentDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "post.response.nextPaymentDate" as const,
    schema: dateSchema.nullable(),
  }),
};

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "preauthorized", "transaction"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "circle-plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transaction_create"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      orderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orderId.label" as const,
        description: "post.orderId.description" as const,
        columns: 6,
        schema: z.string(),
      }),
      targetWalletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.targetWalletId.label" as const,
        description: "post.targetWalletId.description" as const,
        columns: 6,
        schema: z.string(),
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.amount.label" as const,
        description: "post.amount.description" as const,
        columns: 6,
        schema: z.coerce.number(),
      }),
      ordinal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.ordinal.label" as const,
        description: "post.ordinal.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      sourceWalletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sourceWalletId.label" as const,
        description: "post.sourceWalletId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      txDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.txDescription.label" as const,
        description: "post.txDescription.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectType.label" as const,
        description: "post.transactionSubjectType.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectRef: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectRef.label" as const,
        description: "post.transactionSubjectRef.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectQuantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.transactionSubjectQuantity.label" as const,
        description: "post.transactionSubjectQuantity.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      executionMinTime: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.executionMinTime.label" as const,
        description: "post.executionMinTime.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      executionMaxTime: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "post.executionMaxTime.label" as const,
        description: "post.executionMaxTime.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "circle-plus",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
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
        orderId: "ORD-001",
        targetWalletId: "wallet-abc",
        amount: 100,
      },
    },
    responses: {
      default: {
        id: 42,
        orderId: "ORD-001",
        ordinal: 1,
        authorizedBy: "admin",
        targetWalletId: "wallet-abc",
        amount: 100,
        sourceOrgResourceId: null,
        sourceWalletId: null,
        description: null,
        transactionSubjectType: null,
        transactionSubjectRef: null,
        transactionSubjectQuantity: null,
        executionMinTime: null,
        executionMaxTime: null,
        updatedAt: null,
        revokedBy: null,
        executionMaxOrdinal: null,
        state: "PENDING",
        orgResourceId: null,
        expectedPaymentsToDate: null,
        actualPaymentsReceived: null,
        nextPaymentDate: null,
      },
    },
  },
});

export type PreauthorizedTransactionCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type PreauthorizedTransactionCreateResponseOutput =
  typeof POST.types.ResponseOutput;

export { preauthorizedTransactionResponseChildren };

const definitions = { POST } as const;
export default definitions;
