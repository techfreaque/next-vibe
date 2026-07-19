/**
 * Catalog Product Deactivate API Route Definition
 * POST: soft-delete a catalog product by marking isActive = false
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
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const CatalogProductDeactivateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.CatalogProductDeactivateWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["products", "catalog", "[productId]", "deactivate"],
  title: "post.title",
  titleShort: "post.titleShort" as const,
  description: "post.description",
  category: "products",
  subCategory: "Catalog Management",
  tags: ["tags.products", "tags.catalog", "tags.deactivate"],
  allowedRoles: [UserRole.ADMIN],
  icon: "package",

  fields: customWidgetObject({
    render: CatalogProductDeactivateWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL path parameter
      productId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.productId.label",
        description: "post.productId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/products/catalog/list/definition")).default.GET,
        labelField: "name",
      }),

      // Response fields
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.id",
            hidden: true,
            schema: z.uuid(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.isActive",
            schema: z.boolean(),
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
    urlPathParams: {
      default: {
        productId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          isActive: false,
        },
      },
    },
  },
});

export type CatalogDeactivateRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
