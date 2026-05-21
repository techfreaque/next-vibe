import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsResponseField,
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

const PreauthorizedTransactionGetContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionGetContainer,
  })),
);
const PreauthorizedTransactionRevokeContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionRevokeContainer,
  })),
);

const transactionResponseChildren = {
  id: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.id" as const,
    schema: z.number().nullable(),
  }),
  orderId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.orderId" as const,
    schema: z.string(),
  }),
  ordinal: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.ordinal" as const,
    schema: z.number().nullable(),
  }),
  authorizedBy: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.authorizedBy" as const,
    schema: z.string().nullable(),
  }),
  targetWalletId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.targetWalletId" as const,
    schema: z.string(),
  }),
  amount: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.amount" as const,
    schema: z.number(),
  }),
  sourceOrgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.sourceOrgResourceId" as const,
    schema: z.string().nullable(),
  }),
  sourceWalletId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.sourceWalletId" as const,
    schema: z.string().nullable(),
  }),
  description: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.description" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectType: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.transactionSubjectType" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectRef: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.transactionSubjectRef" as const,
    schema: z.string().nullable(),
  }),
  transactionSubjectQuantity: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.transactionSubjectQuantity" as const,
    schema: z.number().nullable(),
  }),
  executionMinTime: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.executionMinTime" as const,
    schema: dateSchema.nullable(),
  }),
  executionMaxTime: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.executionMaxTime" as const,
    schema: dateSchema.nullable(),
  }),
  updatedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.updatedAt" as const,
    schema: dateSchema.nullable(),
  }),
  revokedBy: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.revokedBy" as const,
    schema: z.string().nullable(),
  }),
  executionMaxOrdinal: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.executionMaxOrdinal" as const,
    schema: z.number().nullable(),
  }),
  state: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.state" as const,
    schema: z.string().nullable(),
  }),
  orgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.orgResourceId" as const,
    schema: z.string().nullable(),
  }),
  expectedPaymentsToDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.expectedPaymentsToDate" as const,
    schema: z.number().nullable(),
  }),
  actualPaymentsReceived: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.actualPaymentsReceived" as const,
    schema: z.number().nullable(),
  }),
  nextPaymentDate: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.nextPaymentDate" as const,
    schema: dateSchema.nullable(),
  }),
};

const exampleTransaction = {
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
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "preauthorized", "transaction", "[transactionId]"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "search",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transaction_get"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionGetContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      transactionId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.transactionId.label" as const,
        description: "get.transactionId.description" as const,
        schema: z.coerce.number(),
      }),
      ...transactionResponseChildren,
      submitButton: submitButton(scopedTranslation, {
        label: "get.submitButton.label" as const,
        loadingText: "get.submitButton.loadingText" as const,
        icon: "search",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  examples: {
    urlPathParams: { default: { transactionId: 42 } },
    responses: { default: { transactionId: 42, ...exampleTransaction } },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "preauthorized", "transaction", "[transactionId]"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "x-circle",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transaction_delete"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionRevokeContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      transactionId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.transactionId.label" as const,
        description: "delete.transactionId.description" as const,
        schema: z.coerce.number(),
      }),
      ...transactionResponseChildren,
      submitButton: submitButton(scopedTranslation, {
        label: "delete.submitButton.label" as const,
        loadingText: "delete.submitButton.loadingText" as const,
        icon: "x-circle",
        variant: "destructive",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },
  examples: {
    urlPathParams: { default: { transactionId: 42 } },
    responses: {
      default: { transactionId: 42, ...exampleTransaction, state: "REVOKED" },
    },
  },
});

export type PreauthorizedTransactionGetUrlParamsOutput =
  typeof GET.types.UrlVariablesOutput;
export type PreauthorizedTransactionGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type PreauthorizedTransactionDeleteUrlParamsOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type PreauthorizedTransactionDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, DELETE } as const;
export default definitions;
