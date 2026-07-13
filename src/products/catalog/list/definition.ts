/**
 * Catalog Product List API Route Definition
 * GET: list catalog products with optional filters
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  objectOptionalField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { ProductType, ProductTypeOptions } from "../../enum";
import { PRODUCTS_CATALOG_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CatalogListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CatalogListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["products", "catalog", "list"],
  aliases: [PRODUCTS_CATALOG_LIST_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort" as const,
  description: "get.description",
  category: "products",
  subCategory: "Catalog Management",
  tags: ["tags.products", "tags.catalog", "tags.list"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "package",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CatalogListWidget,
    children: {
      // === REQUEST FILTERS ===
      filters: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          companyId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (await import("@/companies/list/definition")).default.GET,
            labelField: "name",
            label: "get.companyId.label",
            description: "get.companyId.description",
            schema: z.uuid().optional(),
          }),
          categoryId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (await import("@/products/category/list/definition")).default.GET,
            labelField: "name",
            label: "get.categoryId.label",
            description: "get.categoryId.description",
            schema: z.uuid().optional(),
          }),
          type: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "get.type.label",
            description: "get.type.description",
            placeholder: "get.type.placeholder",
            options: ProductTypeOptions,
            schema: z.enum(ProductType).optional(),
          }),
          isActive: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "get.isActive.label",
            description: "get.isActive.description",
            schema: z.boolean().optional(),
          }),
        },
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label",
        description: "get.page.description",
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label",
        description: "get.pageSize.description",
        schema: z.number().int().min(1).max(100).optional(),
      }),

      // === RESPONSE FIELDS ===
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total",
        schema: z.number(),
      }),
      products: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.name",
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.type",
              enumOptions: ProductTypeOptions,
              schema: z.enum(ProductType),
            }),
            sku: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.sku",
              schema: z.string().nullable(),
            }),
            basePrice: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.basePrice",
              fieldType: FieldDataType.NUMBER,
              schema: z.number(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currency",
              schema: z.string(),
            }),
            unit: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.unit",
              schema: z.string().nullable(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.isActive",
              schema: z.boolean(),
            }),
            isSubscription: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.isSubscription",
              hidden: true,
              schema: z.boolean(),
            }),
            billingInterval: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.billingInterval",
              hidden: true,
              schema: z.string().nullable(),
            }),
            categoryId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.categoryId",
              hidden: true,
              schema: z.uuid().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.createdAt",
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        filters: {
          isActive: true,
        },
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 1,
        products: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Web Design Package",
            type: ProductType.SERVICE,
            sku: "WD-001",
            basePrice: 1500,
            currency: "EUR",
            unit: "project",
            isActive: true,
            isSubscription: false,
            billingInterval: null,
            categoryId: null,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type CatalogListGetResponseOutput = typeof GET.types.ResponseOutput;
export type CatalogListGetRequestOutput = typeof GET.types.RequestOutput;
export type CatalogListGetRequestInput = typeof GET.types.RequestInput;

const definitions = {
  GET,
} as const;
export default definitions;
