import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const ProductListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "products", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "box",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.products" as const],
  aliases: ["corvina_products_list"],

  fields: customWidgetObject({
    render: ProductListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(10),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      products: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.id" as const,
              schema: z.number(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.code" as const,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.products.type" as const,
              schema: z.string(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.label" as const,
              schema: z.string(),
            }),
            dealer: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.products.dealer" as const,
              schema: z.boolean(),
            }),
            trial: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.products.trial" as const,
              schema: z.boolean(),
            }),
            creationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.creationDate" as const,
              schema: z.number().nullable(),
            }),
            lastModified: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.lastModified" as const,
              schema: z.number().nullable(),
            }),
            autorenewDefaultValueForNewLicenses: responseField(
              scopedTranslation,
              {
                type: WidgetType.BADGE,
                content: "get.response.products.autorenewDefault" as const,
                schema: z.boolean(),
              },
            ),
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.products.orgResourceId" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.coerce.number(),
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
    requests: { default: { page: 0, pageSize: 10 } },
    responses: {
      default: {
        products: [
          {
            id: 1,
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
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type ProductsListRequestOutput = typeof GET.types.RequestOutput;
export type ProductsListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
