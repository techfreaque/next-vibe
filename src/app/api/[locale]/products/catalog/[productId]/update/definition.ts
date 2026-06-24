/**
 * Catalog Product Update API Route Definition
 * PATCH: update fields on an existing catalog product
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ProductType, ProductTypeOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";

const CatalogUpdateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CatalogUpdateWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["products", "catalog", "[productId]", "update"],
  title: "patch.title",
  titleShort: "patch.titleShort" as const,
  description: "patch.description",
  category: "products",
  subCategory: "Catalog Management",
  tags: ["tags.products", "tags.catalog", "tags.update"],
  allowedRoles: [UserRole.ADMIN],
  icon: "package",

  fields: customWidgetObject({
    usage: { request: "data&urlPathParams", response: true },
    render: CatalogUpdateWidget,
    children: {
      // URL path parameter
      productId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "patch.productId.label",
        description: "patch.productId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/products/catalog/list/definition"))
            .default.GET,
        labelField: "name",
      }),

      // Request data fields
      fields: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          name: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.name.label",
            description: "patch.name.description",
            placeholder: "patch.name.placeholder",
            schema: z.string().min(1).max(255).optional(),
          }),
          type: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "patch.type.label",
            description: "patch.type.description",
            placeholder: "patch.type.placeholder",
            options: ProductTypeOptions,
            schema: z.enum(ProductType).optional(),
          }),
          productDescription: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "patch.productDescription.label",
            description: "patch.productDescription.description",
            placeholder: "patch.productDescription.placeholder",
            schema: z.string().max(2000).optional(),
          }),
          sku: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.sku.label",
            description: "patch.sku.description",
            placeholder: "patch.sku.placeholder",
            schema: z.string().max(100).optional(),
          }),
          unit: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.unit.label",
            description: "patch.unit.description",
            placeholder: "patch.unit.placeholder",
            schema: z.string().max(50).optional(),
          }),
          basePrice: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "patch.basePrice.label",
            description: "patch.basePrice.description",
            placeholder: "patch.basePrice.placeholder",
            schema: z.number().min(0).optional(),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.currency.label",
            description: "patch.currency.description",
            placeholder: "patch.currency.placeholder",
            schema: z.string().length(3).optional(),
          }),
          defaultTaxRate: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "patch.defaultTaxRate.label",
            description: "patch.defaultTaxRate.description",
            placeholder: "patch.defaultTaxRate.placeholder",
            schema: z.number().min(0).max(1).optional(),
          }),
          categoryId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (
                await import("@/app/api/[locale]/products/category/list/definition")
              ).default.GET,
            labelField: "name",
            label: "patch.categoryId.label",
            description: "patch.categoryId.description",
            schema: z.uuid().optional(),
          }),
          imageUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "patch.imageUrl.label",
            description: "patch.imageUrl.description",
            placeholder: "patch.imageUrl.placeholder",
            schema: z
              .union([z.string().url(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v))
              .optional(),
          }),
          isActive: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "patch.isActive.label",
            description: "patch.isActive.description",
            schema: z.boolean().optional(),
          }),
        },
      }),

      // Response fields
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "patch.response.id",
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "patch.response.name",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        productId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        fields: {
          name: "Web Design Package Pro",
          basePrice: 2000,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Web Design Package Pro",
        },
      },
    },
  },
});

export type CatalogUpdateRequestOutput = typeof PATCH.types.RequestOutput;

const definitions = {
  PATCH,
} as const;
export default definitions;
