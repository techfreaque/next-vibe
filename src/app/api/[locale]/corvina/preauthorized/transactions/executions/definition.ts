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

const PreauthorizedTransactionsExecutionsCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedTransactionsExecutionsCreateContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "preauthorized", "transactions", "executions"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "play",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_transactions_executions_create"],
  fields: customWidgetObject({
    render: PreauthorizedTransactionsExecutionsCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      preauthorizedCreditTransactionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.preauthorizedCreditTransactionId.label" as const,
        description:
          "post.preauthorizedCreditTransactionId.description" as const,
        columns: 6,
        schema: z.coerce.number(),
      }),
      ordinal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.ordinal.label" as const,
        description: "post.ordinal.description" as const,
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
          children: {
            transactionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.transactionId" as const,
              schema: z.number().nullable(),
            }),
            preauthorizedCreditTransactionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "post.response.preauthorizedCreditTransactionId" as const,
              schema: z.number().nullable(),
            }),
            executionTime: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.executionTime" as const,
              schema: dateSchema.nullable(),
            }),
            ordinal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.ordinal" as const,
              schema: z.number().nullable(),
            }),
            executionResult: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.executionResult" as const,
              schema: z.string().nullable(),
            }),
            errorCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errorCode" as const,
              schema: z.number().nullable(),
            }),
            failureReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.failureReason" as const,
              schema: z.string().nullable(),
            }),
            issuer: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.issuer" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "play",
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
    requests: { default: { preauthorizedCreditTransactionId: 42, ordinal: 1 } },
    responses: {
      default: {
        items: [
          {
            transactionId: null,
            preauthorizedCreditTransactionId: 42,
            executionTime: null,
            ordinal: 1,
            executionResult: "SUCCESS",
            errorCode: null,
            failureReason: null,
            issuer: "system",
          },
        ],
      },
    },
  },
});

export type PreauthorizedTransactionsExecutionsCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type PreauthorizedTransactionsExecutionsCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
