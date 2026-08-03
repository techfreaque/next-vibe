/**
 * Catalog Product Create API Route Definition
 * POST: create a new product or service in the catalog
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ProductType, ProductTypeOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const CatalogCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CatalogCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["products", "catalog", "create"],
  title: "post.title",
  titleShort: "post.titleShort" as const,
  description: "post.description",
  category: "products",
  subCategory: "Catalog Management",
  tags: ["tags.products", "tags.catalog", "tags.create"],
  allowedRoles: [UserRole.ADMIN],
  icon: "package",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CatalogCreateWidget,
    children: {
      // === REQUEST FIELDS ===
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          name: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.name.label",
            description: "post.name.description",
            placeholder: "post.name.placeholder",
            schema: z.string().min(1).max(255),
          }),
          type: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.type.label",
            description: "post.type.description",
            placeholder: "post.type.placeholder",
            options: ProductTypeOptions,
            schema: z.enum(ProductType),
          }),
          productDescription: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "post.productDescription.label",
            description: "post.productDescription.description",
            placeholder: "post.productDescription.placeholder",
            schema: z.string().max(2000).optional(),
          }),
          sku: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.sku.label",
            description: "post.sku.description",
            placeholder: "post.sku.placeholder",
            schema: z.string().max(100).optional(),
          }),
          unit: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.unit.label",
            description: "post.unit.description",
            placeholder: "post.unit.placeholder",
            schema: z.string().max(50).optional(),
          }),
          basePrice: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "post.basePrice.label",
            description: "post.basePrice.description",
            placeholder: "post.basePrice.placeholder",
            schema: z.number().min(0),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.currency.label",
            description: "post.currency.description",
            placeholder: "post.currency.placeholder",
            schema: z.string().length(3).default("EUR"),
          }),
          defaultTaxRate: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "post.defaultTaxRate.label",
            description: "post.defaultTaxRate.description",
            placeholder: "post.defaultTaxRate.placeholder",
            schema: z.number().min(0).max(1).optional(),
          }),
          companyId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (await import("@/companies/list/definition")).default.GET,
            labelField: "name",
            label: "post.companyId.label",
            description: "post.companyId.description",
            schema: z.uuid().optional(),
          }),
          categoryId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (await import("@/products/category/list/definition")).default.GET,
            labelField: "name",
            label: "post.categoryId.label",
            description: "post.categoryId.description",
            schema: z.uuid().optional(),
          }),
          imageUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "post.imageUrl.label",
            description: "post.imageUrl.description",
            placeholder: "post.imageUrl.placeholder",
            schema: z
              .union([z.string().url(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
          isSubscription: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.isSubscription.label",
            description: "post.isSubscription.description",
            schema: z.boolean().optional().default(false),
          }),
          billingInterval: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.billingInterval.label",
            description: "post.billingInterval.description",
            placeholder: "post.billingInterval.placeholder",
            hidden: true,
            options: [
              {
                value: "MONTHLY",
                label: "post.billingInterval.monthly",
              },
              {
                value: "YEARLY",
                label: "post.billingInterval.yearly",
              },
            ],
            schema: z.enum(["MONTHLY", "YEARLY"]).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.id",
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.name",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          name: "Web Design Package",
          type: ProductType.SERVICE,
          productDescription: "Full website design including up to 5 pages",
          sku: "WD-001",
          unit: "project",
          basePrice: 1500,
          currency: "EUR",
          defaultTaxRate: 0.19,
          isSubscription: false,
        },
      },
      minimal: {
        details: {
          name: "Consulting Hour",
          type: ProductType.SERVICE,
          basePrice: 150,
          currency: "EUR",
          isSubscription: false,
        },
      },
      subscription: {
        details: {
          name: "Monthly Plan",
          type: ProductType.SERVICE,
          basePrice: 29,
          currency: "EUR",
          isSubscription: true,
          billingInterval: "MONTHLY" as const,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Web Design Package",
        },
      },
    },
  },
});

export type CatalogCreatePostRequestInput = typeof POST.types.RequestInput;
export type CatalogCreatePostRequestOutput = typeof POST.types.RequestOutput;
export type CatalogCreatePostResponseInput = typeof POST.types.ResponseInput;
export type CatalogCreatePostResponseOutput = typeof POST.types.ResponseOutput;

export type CatalogCreateRequestTypeOutput = CatalogCreatePostRequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
