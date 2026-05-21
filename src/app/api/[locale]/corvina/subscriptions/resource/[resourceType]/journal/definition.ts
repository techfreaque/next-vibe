import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsResponseField,
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

const SubscriptionsResourceJournalContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionsResourceJournalContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "subscriptions", "resource", "[resourceType]", "journal"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "book-open",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaSubscriptions",
  tags: ["tags.corvina" as const, "tags.subscriptions" as const],
  aliases: ["corvina_subscriptions_resource_journal"],

  fields: customWidgetObject({
    render: SubscriptionsResourceJournalContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      resourceType: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.resourceType.label" as const,
        description: "get.resourceType.description" as const,
        schema: z.string(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      deviceLabel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.deviceLabel.label" as const,
        description: "get.deviceLabel.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      organizationFilter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.organizationFilter.label" as const,
        description: "get.organizationFilter.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      includeSubOrgs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.includeSubOrgs.label" as const,
        description: "get.includeSubOrgs.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      fromDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fromDate.label" as const,
        description: "get.fromDate.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      toDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.toDate.label" as const,
        description: "get.toDate.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
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
            usage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.usage" as const,
              schema: z.number(),
            }),
            timestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.timestamp" as const,
              schema: z.string().nullable(),
            }),
            grantingOrganization: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.grantingOrganization" as const,
              schema: z.string().nullable(),
            }),
            dealerOrganization: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.dealerOrganization" as const,
              schema: z.string().nullable(),
            }),
            organization: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.organization" as const,
              schema: z.string().nullable(),
            }),
            licenseCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.licenseCode" as const,
              schema: z.string().nullable(),
            }),
            deviceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.deviceId" as const,
              schema: z.number().nullable(),
            }),
            deviceLogicalId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.deviceLogicalId" as const,
              schema: z.string().nullable(),
            }),
            deviceSerialNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.deviceSerialNumber" as const,
              schema: z.string().nullable(),
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
    urlPathParams: { default: { resourceType: "DEVICES" } },
    requests: {
      default: {
        page: 0,
        pageSize: 10,
      },
    },
    responses: {
      default: {
        resourceType: "DEVICES",
        items: [
          {
            usage: 1,
            timestamp: "2024-01-15T10:30:00Z",
            grantingOrganization: "exorde.connex.connectika",
            dealerOrganization: null,
            organization: "exorde.connex.child-org",
            licenseCode: "XXXX-YYYY-ZZZZ-AAAA",
            deviceId: 12345,
            deviceLogicalId: "device-logical-001",
            deviceSerialNumber: "SN-001",
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type SubscriptionsResourceJournalUrlParamsOutput =
  typeof GET.types.UrlVariablesOutput;
export type SubscriptionsResourceJournalRequestOutput =
  typeof GET.types.RequestOutput;
export type SubscriptionsResourceJournalResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
