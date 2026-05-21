import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
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

const WalletBulkContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletBulkContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "wallet", "[walletId]", "bulk"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "layers",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_bulk"],

  fields: customWidgetObject({
    render: WalletBulkContainer,
    usage: { request: "data", response: true } as const,
    children: {
      targetWalletId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.targetWalletId.label" as const,
        description: "post.targetWalletId.description" as const,
        placeholder: "post.targetWalletId.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      orderId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orderId.label" as const,
        description: "post.orderId.description" as const,
        placeholder: "post.orderId.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.amount.label" as const,
        description: "post.amount.description" as const,
        placeholder: "post.amount.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1),
      }),
      ordinal: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.ordinal.label" as const,
        description: "post.ordinal.description" as const,
        placeholder: "post.ordinal.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int().optional(),
      }),
      sourceWalletId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sourceWalletId.label" as const,
        description: "post.sourceWalletId.description" as const,
        placeholder: "post.sourceWalletId.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transferDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transferDescription.label" as const,
        description: "post.transferDescription.description" as const,
        placeholder: "post.transferDescription.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      transactionSubjectType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectType.label" as const,
        description: "post.transactionSubjectType.description" as const,
        placeholder: "post.transactionSubjectType.placeholder" as const,
        columns: 4,
        schema: z.string().optional(),
      }),
      transactionSubjectRef: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transactionSubjectRef.label" as const,
        description: "post.transactionSubjectRef.description" as const,
        placeholder: "post.transactionSubjectRef.placeholder" as const,
        columns: 4,
        schema: z.string().optional(),
      }),
      transactionSubjectQuantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.transactionSubjectQuantity.label" as const,
        description: "post.transactionSubjectQuantity.description" as const,
        placeholder: "post.transactionSubjectQuantity.placeholder" as const,
        columns: 4,
        schema: z.coerce.number().int().optional(),
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
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.id" as const,
              schema: z.number().nullable().optional(),
            }),
            executionResult: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "post.response.items.executionResult" as const,
              schema: z.string().nullable().optional(),
            }),
            failureReason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.failureReason" as const,
              schema: z.string().nullable().optional(),
            }),
            sourceWalletId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.sourceWalletId" as const,
              schema: z.string().nullable().optional(),
            }),
            targetWalletId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.targetWalletId" as const,
              schema: z.string().nullable().optional(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.amount" as const,
              schema: z.number().nullable().optional(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.createdAt" as const,
              schema: dateSchema.nullable(),
            }),
            orderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.orderId" as const,
              schema: z.string().nullable().optional(),
            }),
            ordinal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.ordinal" as const,
              schema: z.number().nullable().optional(),
            }),
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.orgResourceId" as const,
              schema: z.string().nullable().optional(),
            }),
          },
        }),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "layers",
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
        targetWalletId: "b-12345-6789-abcde",
        orderId: "order-12345",
        amount: 100,
        ordinal: 0,
      },
    },
    responses: {
      default: {
        targetWalletId: "b-12345-6789-abcde",
        orderId: "order-12345",
        items: [
          {
            id: 1,
            executionResult: "SUCCESS",
            failureReason: null,
            sourceWalletId: null,
            targetWalletId: "b-12345-6789-abcde",
            amount: 100,
            createdAt: null,
            orderId: "order-12345",
            ordinal: 0,
            orgResourceId: null,
          },
        ],
      },
    },
  },
});

export type WalletBulkRequestOutput = typeof POST.types.RequestOutput;
export type WalletBulkResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
