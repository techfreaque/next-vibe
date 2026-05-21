import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const PreauthorizedTransactionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionsListContainer,
  })),
);
const PreauthorizedTransactionsBulkCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionsBulkCreateContainer,
  })),
);
const PreauthorizedTransactionsBulkRevokeContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionsBulkRevokeContainer,
  })),
);

const transactionItemChildren = {
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
  path: ["corvina", "preauthorized", "transactions"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "list",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transactions_list"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      targetWalletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.targetWalletId.label" as const,
        description: "get.targetWalletId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      orderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orderId.label" as const,
        description: "get.orderId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 3,
        schema: z.coerce.number().optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 3,
        schema: z.coerce.number().optional().default(10),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: transactionItemChildren,
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.number(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "get.submitButton.label" as const,
        loadingText: "get.submitButton.loadingText" as const,
        icon: "list",
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
    requests: { default: { page: 0, pageSize: 10 } },
    responses: {
      default: {
        items: [exampleTransaction],
        total: 1,
        currentPage: 0,
        totalPages: 1,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "preauthorized", "transactions"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transactions_create"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionsBulkCreateContainer,
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
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: transactionItemChildren,
        }),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
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
    responses: { default: { items: [exampleTransaction] } },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "preauthorized", "transactions"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "x-circle",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transactions_delete"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionsBulkRevokeContainer,
    usage: { request: "data", response: true } as const,
    children: {
      transactionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.transactionId.label" as const,
        description: "delete.transactionId.description" as const,
        columns: 6,
        schema: z.coerce.number(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: transactionItemChildren,
        }),
      }),
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
    requests: { default: { transactionId: 42 } },
    responses: {
      default: { items: [{ ...exampleTransaction, state: "REVOKED" }] },
    },
  },
});

export type PreauthorizedTransactionsListRequestOutput =
  typeof GET.types.RequestOutput;
export type PreauthorizedTransactionsListResponseOutput =
  typeof GET.types.ResponseOutput;
export type PreauthorizedTransactionsBulkCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type PreauthorizedTransactionsBulkCreateResponseOutput =
  typeof POST.types.ResponseOutput;
export type PreauthorizedTransactionsBulkDeleteRequestOutput =
  typeof DELETE.types.RequestOutput;
export type PreauthorizedTransactionsBulkDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, POST, DELETE } as const;
export default definitions;
