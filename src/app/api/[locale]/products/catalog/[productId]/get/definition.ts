/**
 * Catalog Product Get API Route Definition
 * GET: retrieve a single catalog product by ID
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import listDef0 from "@/app/api/[locale]/products/catalog/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
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

import { scopedTranslation } from "./i18n";

const CatalogProductGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CatalogProductGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["products", "catalog", "[productId]", "get"],
  aliases: ["catalog-product-get"],
  title: "get.title",
  titleShort: "get.titleShort" as const,
  description: "get.description",
  category: "products",
  subCategory: "Catalog Management",
  tags: ["tags.products", "tags.catalog", "tags.get"],
  allowedRoles: [UserRole.ADMIN],
  icon: "package",

  fields: customWidgetObject({
    render: CatalogProductGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      productId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "get.productId.label" as const,
        description: "get.productId.description" as const,
        schema: z.uuid(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),

      result: objectField(scopedTranslation, {
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
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.companyId",
            schema: z.uuid().nullable(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.name",
            schema: z.string(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.description",
            schema: z.string().nullable(),
          }),
          sku: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.sku",
            schema: z.string().nullable(),
          }),
          type: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.type",
            schema: z.string(),
          }),
          unit: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.unit",
            schema: z.string().nullable(),
          }),
          basePrice: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.basePrice",
            schema: z.number(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.currency",
            schema: z.string(),
          }),
          defaultTaxRate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.defaultTaxRate",
            schema: z.number().nullable(),
          }),
          categoryId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.categoryId",
            schema: z.uuid().nullable(),
          }),
          imageUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.imageUrl",
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
            schema: z.boolean(),
          }),
          billingInterval: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.billingInterval",
            schema: z.string().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.createdAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.updatedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
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
    urlPathParams: {
      default: {
        productId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          companyId: null,
          name: "Web Design Package",
          description: "Full website design including up to 5 pages",
          sku: "WD-001",
          type: "SERVICE",
          unit: "hour",
          basePrice: 150,
          currency: "EUR",
          defaultTaxRate: 0.19,
          categoryId: null,
          imageUrl: null,
          isActive: true,
          isSubscription: false,
          billingInterval: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      },
    },
  },
});

export type CatalogGetRequestOutput = typeof GET.types.RequestOutput;
export type CatalogGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
