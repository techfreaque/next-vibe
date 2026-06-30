/**
 * Company Subscription List API Endpoint Definition
 * Lists all subscriptions for a company
 */

import { z } from "zod";

import {
  PaymentProvider,
  PaymentProviderDB,
} from "@/app/api/[locale]/payment/enum";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
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

import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../../enum";
import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "company", "[companyId]", "list"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "crown",
  category: "payments",
  subCategory: "Management",
  tags: ["tags.subscription", "tags.company", "tags.list"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    noCard: true,
    usage: { request: "urlPathParams", response: true },
    children: {
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
        label: "get.companyId.label",
        description: "get.companyId.description",
        hidden: true,
        schema: z.uuid(),
      }),

      subscriptions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid(),
            }),
            plan: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(SubscriptionPlan),
            }),
            billingInterval: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(BillingInterval),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(SubscriptionStatus),
            }),
            currentPeriodStart: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              schema: dateSchema,
            }),
            currentPeriodEnd: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              schema: dateSchema,
            }),
            cancelAtPeriodEnd: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.boolean(),
            }),
            cancelAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema.optional(),
            }),
            canceledAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema.optional(),
            }),
            endedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema.optional(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(PaymentProviderDB),
            }),
            providerSubscriptionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().optional(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              schema: dateSchema,
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
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        subscriptions: [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            plan: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.MONTHLY,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: "2024-01-01T00:00:00Z",
            currentPeriodEnd: "2024-02-01T00:00:00Z",
            cancelAtPeriodEnd: false,
            provider: PaymentProvider.STRIPE,
            providerSubscriptionId: "sub_123456789",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
      },
    },
  },
});

export type CompanySubscriptionListRequestOutput =
  typeof GET.types.RequestOutput;
export type CompanySubscriptionListResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
