import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestResponseField,
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

const ProductDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductDetailContainer })),
);
const ProductUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductUpdateContainer })),
);
const ProductDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductDeleteContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "products", "[productId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "box",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.products" as const],
  aliases: ["corvina_products_get"],

  fields: customWidgetObject({
    render: ProductDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      productId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.productId.label" as const,
        description: "get.productId.description" as const,
        schema: z.coerce.number(),
      }),
      code: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.code" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.type" as const,
        schema: z.string(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label" as const,
        schema: z.string(),
      }),
      dealer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dealer" as const,
        schema: z.boolean(),
      }),
      trial: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.trial" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      lastModified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastModified" as const,
        schema: z.number().nullable().optional(),
      }),
      autorenewDefaultValueForNewLicenses: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.autorenewDefault" as const,
        schema: z.boolean(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
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
    urlPathParams: { default: { productId: 42 } },
    responses: {
      default: {
        productId: 42,
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        label: "Corvina Standard",
        dealer: false,
        trial: false,
        creationDate: 1700000000000,
        lastModified: 1700000000000,
        autorenewDefaultValueForNewLicenses: true,
        orgResourceId: null,
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "products", "[productId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "box",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.products" as const],
  aliases: ["corvina_products_update"],

  fields: customWidgetObject({
    render: ProductUpdateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      productId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.productId.label" as const,
        description: "put.productId.description" as const,
        schema: z.coerce.number(),
      }),
      code: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.code.label" as const,
        description: "put.code.description" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      type: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.type.label" as const,
        description: "put.type.description" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      productLabel: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.productLabel.label" as const,
        description: "put.productLabel.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      trial: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.trial.label" as const,
        description: "put.trial.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      autorenewDefaultValueForNewLicenses: requestResponseField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "put.autorenewDefault.label" as const,
          description: "put.autorenewDefault.description" as const,
          columns: 6,
          schema: z.boolean().default(false),
        },
      ),
      dealer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dealer" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      lastModified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastModified" as const,
        schema: z.number().nullable().optional(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
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
    urlPathParams: { default: { productId: 42 } },
    requests: {
      default: {
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        productLabel: "Corvina Standard",
        trial: false,
        autorenewDefaultValueForNewLicenses: true,
      },
    },
    responses: {
      default: {
        productId: 42,
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        productLabel: "Corvina Standard",
        dealer: false,
        trial: false,
        creationDate: 1700000000000,
        lastModified: 1700000000000,
        autorenewDefaultValueForNewLicenses: true,
        orgResourceId: null,
      },
    },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "products", "[productId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "box",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.products" as const],
  aliases: ["corvina_products_delete"],

  fields: customWidgetObject({
    render: ProductDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      productId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.productId.label" as const,
        description: "delete.productId.description" as const,
        schema: z.coerce.number(),
      }),
      code: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.code" as const,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.type" as const,
        schema: z.string(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label" as const,
        schema: z.string(),
      }),
      dealer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.dealer" as const,
        schema: z.boolean(),
      }),
      trial: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.trial" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      lastModified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.lastModified" as const,
        schema: z.number().nullable().optional(),
      }),
      autorenewDefaultValueForNewLicenses: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.autorenewDefault" as const,
        schema: z.boolean(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
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
    urlPathParams: { default: { productId: 42 } },
    responses: {
      default: {
        productId: 42,
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        label: "Corvina Standard",
        dealer: false,
        trial: false,
        creationDate: 1700000000000,
        lastModified: 1700000000000,
        autorenewDefaultValueForNewLicenses: true,
        orgResourceId: null,
      },
    },
  },
});

export type ProductGetUrlParamsOutput = typeof GET.types.UrlVariablesOutput;
export type ProductGetResponseOutput = typeof GET.types.ResponseOutput;
export type ProductPutUrlParamsOutput = typeof PUT.types.UrlVariablesOutput;
export type ProductPutRequestOutput = typeof PUT.types.RequestOutput;
export type ProductPutResponseOutput = typeof PUT.types.ResponseOutput;
export type ProductDeleteUrlParamsOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type ProductDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { GET, PUT, DELETE } as const;
export default definitions;
