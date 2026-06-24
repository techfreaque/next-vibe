/**
 * Product Category Create API Route Definition
 * POST: create a product category
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

const ProductCategoryCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductCategoryCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["products", "category", "create"],
  title: "post.title",
  titleShort: "post.titleShort" as const,
  description: "post.description",
  category: "products",
  subCategory: "Category Management",
  tags: ["tags.products", "tags.category", "tags.create"],
  allowedRoles: [UserRole.ADMIN],
  icon: "folder",

  fields: customWidgetObject({
    render: ProductCategoryCreateWidgetLazy,
    usage: { request: "data", response: true },
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
          companyId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (await import("@/app/api/[locale]/companies/list/definition"))
                .default.GET,
            labelField: "name",
            label: "post.companyId.label",
            description: "post.companyId.description",
            schema: z.uuid().optional(),
          }),
          parentId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.ENTITY_PICKER,
            listEndpoint: async () =>
              (
                await import("@/app/api/[locale]/products/category/list/definition")
              ).default.GET,
            labelField: "name",
            label: "post.parentId.label",
            description: "post.parentId.description",
            schema: z.uuid().optional(),
          }),
          sortOrder: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "post.sortOrder.label",
            description: "post.sortOrder.description",
            placeholder: "post.sortOrder.placeholder",
            schema: z.number().int().min(0).default(0),
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
          name: "Design Services",
          sortOrder: 0,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Design Services",
        },
      },
    },
  },
});

export type CategoryCreatePostRequestInput = typeof POST.types.RequestInput;
export type CategoryCreatePostRequestOutput = typeof POST.types.RequestOutput;
export type CategoryCreateRequestTypeOutput = CategoryCreatePostRequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
