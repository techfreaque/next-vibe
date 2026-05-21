import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
  requestUrlPathParamsResponseField,
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

import { WalletType } from "../enums";
import { scopedTranslation } from "./i18n";

const WalletDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletDetailContainer })),
);

const WalletUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WalletUpdateContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "wallet", "[walletId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "wallet",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_get"],

  fields: customWidgetObject({
    render: WalletDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      walletId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.walletId.label" as const,
        description: "get.walletId.description" as const,
        schema: z.string().min(1),
      }),
      id: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.id" as const,
        description: "get.response.id" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      type: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.type" as const,
        description: "get.response.type" as const,
        columns: 6,
        schema: z.enum(WalletType).optional(),
      }),
      description: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.description" as const,
        description: "get.response.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      webhookUrl: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.webhookUrl" as const,
        description: "get.response.webhookUrl" as const,
        columns: 12,
        schema: z.string().optional(),
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
    urlPathParams: { default: { walletId: "wallet-001" } },
    responses: {
      default: {
        walletId: "wallet-001",
        id: "wallet-001",
        type: WalletType.GENERIC,
        description: "Main wallet",
        webhookUrl: "https://example.com/webhook",
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "wallet", "[walletId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.wallet" as const],
  aliases: ["corvina_wallet_update"],

  fields: customWidgetObject({
    render: WalletUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      walletId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.walletId.label" as const,
        description: "put.walletId.description" as const,
        schema: z.string().min(1),
      }),
      id: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.id" as const,
        description: "get.response.id" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      type: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.type.label" as const,
        description: "put.type.description" as const,
        placeholder: "put.type.placeholder" as const,
        columns: 6,
        schema: z.enum(WalletType).optional(),
      }),
      description: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.description.label" as const,
        description: "put.description.description" as const,
        placeholder: "put.description.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      webhookUrl: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.webhookUrl.label" as const,
        description: "put.webhookUrl.description" as const,
        placeholder: "put.webhookUrl.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "put.submitButton.label" as const,
        loadingText: "put.submitButton.loadingText" as const,
        icon: "save",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "put.errors.unauthorized.title" as const,
      description: "put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "put.errors.validation.title" as const,
      description: "put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "put.errors.forbidden.title" as const,
      description: "put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "put.errors.notFound.title" as const,
      description: "put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "put.errors.conflict.title" as const,
      description: "put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "put.errors.server.title" as const,
      description: "put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "put.errors.network.title" as const,
      description: "put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "put.errors.unsavedChanges.title" as const,
      description: "put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "put.errors.unknown.title" as const,
      description: "put.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "put.success.title" as const,
    description: "put.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { walletId: "wallet-001" } },
    requests: {
      default: {
        id: "wallet-001",
        type: WalletType.GENERIC,
        description: "Main wallet",
        webhookUrl: "https://example.com/webhook",
      },
    },
    responses: {
      default: {
        walletId: "wallet-001",
        id: "wallet-001",
        type: WalletType.GENERIC,
        description: "Main wallet",
        webhookUrl: "https://example.com/webhook",
      },
    },
  },
});

export type WalletGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type WalletGetResponseOutput = typeof GET.types.ResponseOutput;

export type WalletPutUrlVariablesOutput = typeof PUT.types.UrlVariablesOutput;
export type WalletPutRequestOutput = typeof PUT.types.RequestOutput;
export type WalletPutResponseOutput = typeof PUT.types.ResponseOutput;

const definitions = { GET, PUT } as const;
export default definitions;
