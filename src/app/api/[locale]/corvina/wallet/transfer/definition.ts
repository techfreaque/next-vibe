import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
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

const WalletTransferContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletTransferContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "wallet", "transfer"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "arrow-right-left",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_transfer"],

  fields: customWidgetObject({
    render: WalletTransferContainer,
    usage: { request: "data", response: true } as const,
    children: {
      sourceWalletId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sourceWalletId.label" as const,
        description: "post.sourceWalletId.description" as const,
        placeholder: "post.sourceWalletId.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      targetWalletId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.targetWalletId.label" as const,
        description: "post.targetWalletId.description" as const,
        placeholder: "post.targetWalletId.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
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
      orderId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orderId.label" as const,
        description: "post.orderId.description" as const,
        placeholder: "post.orderId.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
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
        columns: 6,
        schema: z.string().optional(),
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
      transferDescription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.transferDescription.label" as const,
        description: "post.transferDescription.description" as const,
        placeholder: "post.transferDescription.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      errorCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.errorCode" as const,
        schema: z.number().nullable().optional(),
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
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "arrow-right-left",
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
        sourceWalletId: "source-wallet-01",
        targetWalletId: "target-wallet-01",
        amount: 100,
        orderId: "order-12345",
      },
    },
    responses: {
      default: {
        id: 9001,
        sourceWalletId: "source-wallet-01",
        targetWalletId: "target-wallet-01",
        amount: 100,
        executionResult: "SUCCESS",
        failureReason: null,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        issuedBy: "system",
        orderId: "order-12345",
        ordinal: undefined,
        authorizedBy: undefined,
        sourceOrgResourceId: undefined,
        errorCode: undefined,
      },
    },
  },
});

export type WalletTransferRequestOutput = typeof POST.types.RequestOutput;
export type WalletTransferResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
