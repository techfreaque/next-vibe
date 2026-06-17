/**
 * Product Category List API Route Definition
 * GET: list product categories for a company or owner
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import companiesListDefinitions from "@/app/api/[locale]/companies/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  objectOptionalField,
  requestField,
  responseArrayField,
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

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { scopedTranslation } from "./i18n";
import { scopedTranslation } from "./i18n";

import companiesListDefinitions from "@/app/api/[locale]/companies/list/definition";
import { scopedTranslation } from "./i18n";
import { PRODUCTS_CATEGORY_LIST_ALIAS } from "./constants";

const ProductCategoryListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductCategoryListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["products", "category", "list"],
  aliases: [PRODUCTS_CATEGORY_LIST_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort" as const,
  description: "get.description",
  category: "products",
  subCategory: "Category Management",
  tags: ["tags.products", "tags.category", "tags.list"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "folder",

  fields: customWidgetObject({
    render: ProductCategoryListWidgetLazy,
    usage: { request: "data", response: true },
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
            listEndpoint: companiesListDefinitions.GET,
            labelField: "name",
            label: "get.companyId.label",
            description: "get.companyId.description",
            schema: z.uuid().optional(),
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
        content: "get.response.total",
        schema: z.number(),
      }),
      categories: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.name",
              schema: z.string(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.parentId",
              hidden: true,
              schema: z.uuid().nullable(),
            }),
            sortOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sortOrder",
              fieldType: FieldDataType.NUMBER,
              schema: z.number().nullable(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.isActive",
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.createdAt",
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
        filters: {},
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 1,
        categories: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Design Services",
            parentId: null,
            sortOrder: 0,
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type CategoryListGetResponseOutput = typeof GET.types.ResponseOutput;
export type CategoryListGetRequestOutput = typeof GET.types.RequestOutput;

const definitions = {
  GET,
} as const;
export default definitions;
