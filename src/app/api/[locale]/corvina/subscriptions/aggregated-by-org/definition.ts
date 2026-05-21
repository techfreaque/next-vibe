import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
  submitButton,
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

const SubscriptionsAggregatedByOrgContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionsAggregatedByOrgContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "subscriptions", "aggregated-by-org"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bar-chart-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaSubscriptions",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_aggregated_by_org"],

  fields: customWidgetObject({
    render: SubscriptionsAggregatedByOrgContainer,
    usage: { request: "data", response: true } as const,
    children: {
      organizations: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.organizations.label" as const,
        description: "post.organizations.description" as const,
        placeholder: "post.organizations.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
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
            org: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.org" as const,
              schema: z.string(),
            }),
            resourceType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.resourceType" as const,
              schema: z.string(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.quantity" as const,
              schema: z.number(),
            }),
            used: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.used" as const,
              schema: z.number(),
            }),
            licensed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.licensed" as const,
              schema: z.number(),
            }),
            granted: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.granted" as const,
              schema: z.number(),
            }),
            grantedUsed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.grantedUsed" as const,
              schema: z.number(),
            }),
            lastUpdateFreeQuantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.items.lastUpdateFreeQuantity" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "bar-chart-2",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        organizations: "exorde.connex.connectika,exorde.connex.child-org",
      },
    },
    responses: {
      default: {
        items: [
          {
            org: "exorde.connex.connectika",
            resourceType: "DEVICE",
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

export type SubscriptionsAggregatedByOrgRequestOutput =
  typeof POST.types.RequestOutput;
export type SubscriptionsAggregatedByOrgResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
