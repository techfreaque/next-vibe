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

const SubscriptionsSummaryByOrgContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionsSummaryByOrgContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "subscriptions", "summary-by-org"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "building",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_summary_by_org"],

  fields: customWidgetObject({
    render: SubscriptionsSummaryByOrgContainer,
    usage: { request: "data", response: true } as const,
    children: {
      createdByOrgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.createdByOrgResourceId.label" as const,
        description: "get.createdByOrgResourceId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
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
      expired: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.expired.label" as const,
        description: "get.expired.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label" as const,
        description: "get.search.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.orgResourceId" as const,
              schema: z.string().nullable(),
            }),
            licenseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.licenseId" as const,
              schema: z.number(),
            }),
            productCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.productCode" as const,
              schema: z.string(),
            }),
            productLabel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.productLabel" as const,
              schema: z.string(),
            }),
            productType: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.items.productType" as const,
              schema: z.string(),
            }),
            licenseCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.licenseCode" as const,
              schema: z.string(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.currency" as const,
              schema: z.string().nullable(),
            }),
            price: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.price" as const,
              schema: z.number().nullable(),
            }),
            autorenew: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.items.autorenew" as const,
              schema: z.boolean(),
            }),
            trial: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.items.trial" as const,
              schema: z.boolean(),
            }),
            expirationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.expirationDate" as const,
              schema: z.number().nullable(),
            }),
            activationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.activationDate" as const,
              schema: z.number().nullable(),
            }),
            creationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.creationDate" as const,
              schema: z.number().nullable(),
            }),
            resources: responseArrayField(scopedTranslation, {
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
                    content:
                      "get.response.items.resources.resourceType" as const,
                    schema: z.string(),
                  }),
                  quantity: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.items.resources.quantity" as const,
                    schema: z.number(),
                  }),
                  used: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.items.resources.used" as const,
                    schema: z.number(),
                  }),
                  expired: responseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    content: "get.response.items.resources.expired" as const,
                    schema: z.boolean(),
                  }),
                },
              }),
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
    requests: {
      default: {
        createdByOrgResourceId: "exorde.connex.connectika",
        page: 0,
        pageSize: 10,
      },
    },
    responses: {
      default: {
        items: [
          {
            orgResourceId: "exorde.connex.child-org",
            licenseId: 1001,
            productCode: "CORVINA_STANDARD",
            productLabel: "Corvina Standard",
            productType: "STANDARD",
            licenseCode: "XXXX-YYYY-ZZZZ-AAAA",
            currency: "EUR",
            price: 99.0,
            autorenew: true,
            trial: false,
            expirationDate: 1800000000000,
            activationDate: 1700100000000,
            creationDate: 1700000000000,
            resources: [
              {
                resourceType: "DEVICE",
                quantity: 50,
                used: 12,
                expired: false,
              },
            ],
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type SubscriptionsSummaryByOrgRequestOutput =
  typeof GET.types.RequestOutput;
export type SubscriptionsSummaryByOrgResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
