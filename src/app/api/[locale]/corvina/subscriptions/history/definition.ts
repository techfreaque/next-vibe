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

const SubscriptionsHistoryContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionsHistoryContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "subscriptions", "history"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "clock",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_history"],

  fields: customWidgetObject({
    render: SubscriptionsHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      fromDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fromDate.label" as const,
        description: "get.fromDate.description" as const,
        columns: 6,
        schema: z.string().min(1),
        placeholder: "get.fromDate.placeholder" as const,
      }),
      toDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.toDate.label" as const,
        description: "get.toDate.description" as const,
        columns: 6,
        schema: z.string().min(1),
        placeholder: "get.toDate.placeholder" as const,
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      resourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.resourceId.label" as const,
        description: "get.resourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().default(10),
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
            resourceType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.resourceType" as const,
              schema: z.string(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.quantity" as const,
              schema: z.number(),
            }),
            used: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.used" as const,
              schema: z.number(),
            }),
            granted: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.granted" as const,
              schema: z.number(),
            }),
            grantedUsed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.grantedUsed" as const,
              schema: z.number(),
            }),
            licensed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.licensed" as const,
              schema: z.number(),
            }),
            timestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.timestamp" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.number(),
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
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
        page: 0,
        pageSize: 10,
      },
    },
    responses: {
      default: {
        items: [
          {
            resourceType: "DEVICE",
            quantity: 100,
            used: 42,
            granted: 10,
            grantedUsed: 5,
            licensed: 90,
            timestamp: 1704067200000,
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type SubscriptionsHistoryRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionsHistoryResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
