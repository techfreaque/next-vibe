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

const SubscriptionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SubscriptionsListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "subscriptions", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "layers",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_list"],

  fields: customWidgetObject({
    render: SubscriptionsListContainer,
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
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.status.label" as const,
        description: "get.status.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      subscriptions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            resourceType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.resourceType" as const,
              schema: z.string(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.quantity" as const,
              schema: z.number(),
            }),
            used: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.used" as const,
              schema: z.number(),
            }),
            expirationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.expirationDate" as const,
              schema: z.number().nullable(),
            }),
            creationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.creationDate" as const,
              schema: z.number().nullable(),
            }),
            expired: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.subscriptions.expired" as const,
              schema: z.boolean(),
            }),
            productCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.productCode" as const,
              schema: z.string(),
            }),
            productLabel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.productLabel" as const,
              schema: z.string(),
            }),
            licenseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.licenseId" as const,
              schema: z.number(),
            }),
            productId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.subscriptions.productId" as const,
              schema: z.number(),
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
        subscriptions: [
          {
            resourceType: "DEVICE",
            quantity: 100,
            used: 42,
            expirationDate: 1800000000000,
            creationDate: 1700000000000,
            expired: false,
            productCode: "CORVINA_STANDARD",
            productLabel: "Corvina Standard",
            licenseId: 1001,
            productId: 5,
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type SubscriptionsListRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionsListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
