/**
 * POS Product Lookup API Route Definition
 * Search catalog products for use at point-of-sale
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { POS_PRODUCT_LOOKUP_ALIAS } from "./constants";

const PosProductLookupWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosProductLookupWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "product-lookup"],
  aliases: [POS_PRODUCT_LOOKUP_ALIAS] as const,
  title: "productLookup.get.title",
  titleShort: "productLookup.get.titleShort" as const,
  description: "productLookup.get.description",
  category: "pos",
  subCategory: "POS: Products",
  tags: ["tags.pos", "tags.addItem", "tags.list"],
  allowedRoles: [UserRole.ADMIN],
  icon: "search",

  fields: customWidgetObject({
    render: PosProductLookupWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "productLookup.get.companyId.label",
        description: "productLookup.get.companyId.description",
        schema: z.uuid().optional(),
      }),
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "productLookup.get.query.label",
        description: "productLookup.get.query.description",
        placeholder: "productLookup.get.query.placeholder",
        schema: z.string().min(1),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "productLookup.get.page.label",
        description: "productLookup.get.page.description",
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "productLookup.get.pageSize.label",
        description: "productLookup.get.pageSize.description",
        schema: z.number().int().min(1).max(50).optional(),
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
              label: "productLookup.get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.name",
              schema: z.string(),
            }),
            sku: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.sku",
              schema: z.string().nullable(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.type",
              schema: z.string(),
            }),
            basePrice: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.basePrice",
              fieldType: FieldDataType.NUMBER,
              schema: z.number(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.currency",
              schema: z.string(),
            }),
            defaultTaxRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.defaultTaxRate",
              schema: z.number().nullable(),
            }),
            unit: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "productLookup.get.response.unit",
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "productLookup.get.errors.validation.title",
      description: "productLookup.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "productLookup.get.errors.unauthorized.title",
      description: "productLookup.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "productLookup.get.errors.forbidden.title",
      description: "productLookup.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "productLookup.get.errors.conflict.title",
      description: "productLookup.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "productLookup.get.errors.server.title",
      description: "productLookup.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "productLookup.get.errors.unknown.title",
      description: "productLookup.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "productLookup.get.errors.network.title",
      description: "productLookup.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "productLookup.get.errors.notFound.title",
      description: "productLookup.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "productLookup.get.errors.unsavedChanges.title",
      description: "productLookup.get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "productLookup.get.success.title",
    description: "productLookup.get.success.description",
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
        query: "coffee",
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        products: [
          {
            id: "aabbccdd-e89b-12d3-a456-426614174001",
            name: "Coffee",
            sku: "BEV-001",
            type: "PRODUCT",
            basePrice: 3.5,
            currency: "EUR",
            defaultTaxRate: 0.19,
            unit: "cup",
          },
        ],
      },
    },
  },
});

export type PosProductLookupGetRequestOutput = typeof GET.types.RequestOutput;
export type PosProductLookupGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
