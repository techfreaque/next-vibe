import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsResponseField,
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

const PreauthorizedExecutionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PreauthorizedExecutionsListContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: [
    "corvina",
    "preauthorized",
    "transaction",
    "[transactionId]",
    "executions",
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "list",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.preauthorized" as const],
  aliases: ["corvina_preauthorized_executions_list"],
  fields: customWidgetObject({
    render: PreauthorizedExecutionsListContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      transactionId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.transactionId.label" as const,
        description: "get.transactionId.description" as const,
        schema: z.coerce.number(),
      }),
      ordinal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.ordinal.label" as const,
        description: "get.ordinal.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      issuer: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.issuer.label" as const,
        description: "get.issuer.description" as const,
        columns: 6,
        schema: z.string().optional(),
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
              content: "get.response.transactionId" as const,
              schema: z.number().nullable(),
            }),
            preauthorizedCreditTransactionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.preauthorizedCreditTransactionId" as const,
              schema: z.number().nullable(),
            }),
            executionTime: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.executionTime" as const,
              schema: dateSchema.nullable(),
            }),
            ordinal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.ordinal" as const,
              schema: z.number().nullable(),
            }),
            executionResult: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.executionResult" as const,
              schema: z.string().nullable(),
            }),
            errorCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.errorCode" as const,
              schema: z.number().nullable(),
            }),
            failureReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.failureReason" as const,
              schema: z.string().nullable(),
            }),
            issuer: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.issuer" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
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
    urlPathParams: { default: { transactionId: 42 } },
    requests: { default: {} },
    responses: {
      default: {
        transactionId: 42,
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

export type PreauthorizedExecutionsListUrlParamsOutput =
  typeof GET.types.UrlVariablesOutput;
export type PreauthorizedExecutionsListRequestOutput =
  typeof GET.types.RequestOutput;
export type PreauthorizedExecutionsListResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
