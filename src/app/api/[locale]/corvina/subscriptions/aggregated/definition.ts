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

const SubscriptionsAggregatedContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionsAggregatedContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "subscriptions", "aggregated"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "bar-chart-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaSubscriptions",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_aggregated"],

  fields: customWidgetObject({
    render: SubscriptionsAggregatedContainer,
    usage: { request: "data", response: true } as const,
    children: {
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
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
            resourceType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.resourceType" as const,
              schema: z.string(),
            }),
            org: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.org" as const,
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
            licensed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.licensed" as const,
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
            lastUpdateFreeQuantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.lastUpdateFreeQuantity" as const,
              schema: z.number(),
            }),
          },
        }),
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
    requests: { default: {} },
    responses: {
      default: {
        items: [
          {
            resourceType: "DEVICE",
            org: "exorde.connex.connectika",
            quantity: 100,
            used: 42,
            licensed: 90,
            granted: 10,
            grantedUsed: 5,
            lastUpdateFreeQuantity: 1704067200000,
          },
        ],
      },
    },
  },
});

export type SubscriptionsAggregatedRequestOutput =
  typeof GET.types.RequestOutput;
export type SubscriptionsAggregatedResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
