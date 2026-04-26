/**
 * Unified Messenger Accounts List API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { UserRole } from "../../../user/user-roles/enum";
import {
  MessengerAccountStatus,
  MessengerAccountStatusDB,
  MessengerAccountStatusFilterOptions,
  MessengerAccountSortField,
  MessengerAccountSortFieldOptions,
  MessengerChannelFilterOptions,
  MessengerHealthStatus,
  MessengerHealthStatusDB,
  MessengerProvider,
  MessengerProviderDB,
  MessengerProviderFilterDB,
  MessengerProviderFilterOptions,
  MessengerSortOrder,
  MessengerSortOrderOptions,
  MessengerChannelFilter,
  MessengerAccountStatusFilter,
} from "../enum";
import { scopedTranslation } from "./i18n";
import { MessageChannel, MessageChannelDB } from "../enum";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const MessengerAccountsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.MessengerAccountsListContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "accounts", "list"],
  title: "title",
  description: "description",
  category: "endpointCategories.messenger",
  subCategory: "endpointCategories.messengerAccounts",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessengerAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      channel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 3,
        options: MessengerChannelFilterOptions,
        schema: z
          .enum(MessengerChannelFilter)
          .default(MessengerChannelFilter.ANY),
      }),

      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.provider.label",
        description: "fields.provider.description",
        columns: 3,
        options: MessengerProviderFilterOptions,
        schema: z.enum(MessengerProviderFilterDB).optional(),
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        columns: 3,
        options: MessengerAccountStatusFilterOptions,
        schema: z
          .enum(MessengerAccountStatusFilter)
          .default(MessengerAccountStatusFilter.ANY),
      }),

      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.search.label",
        description: "fields.search.description",
        placeholder: "fields.search.placeholder",
        columns: 3,
        schema: z.string().optional(),
      }),

      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortBy.label",
        description: "fields.sortBy.description",
        columns: 3,
        options: MessengerAccountSortFieldOptions,
        schema: z.enum(MessengerAccountSortField).optional(),
      }),

      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortOrder.label",
        description: "fields.sortOrder.description",
        columns: 3,
        options: MessengerSortOrderOptions,
        schema: z.enum(MessengerSortOrder).optional(),
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "response.account.title",
          description: "response.account.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.id",
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.name",
              schema: z.string(),
            }),
            channel: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.channel",
              schema: z.enum(MessageChannelDB),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.provider",
              schema: z.enum(MessengerProviderDB),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.status",
              schema: z.enum(MessengerAccountStatusDB),
            }),
            healthStatus: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.healthStatus",
              schema: z.enum(MessengerHealthStatusDB).nullable(),
            }),
            isDefault: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.isDefault",
              schema: z.boolean(),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.priority",
              schema: z.coerce.number().int(),
            }),
            smtpFromEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.smtpFromEmail",
              schema: z.string().nullable(),
            }),
            fromId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.fromId",
              schema: z.string().nullable(),
            }),
            messagesSentTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.messagesSentTotal",
              schema: z.coerce.number().int(),
            }),
            lastUsedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.lastUsedAt",
              schema: dateSchema.nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.createdAt",
              schema: dateSchema,
            }),
          },
        }),
      }),

      pagination: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.pagination.title",
        description: "response.pagination.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          page: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.page",
            schema: z.coerce.number().int(),
          }),
          limit: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.limit",
            schema: z.coerce.number().int(),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.total",
            schema: z.coerce.number().int(),
          }),
          totalPages: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.totalPages",
            schema: z.coerce.number().int(),
          }),
        },
      }),
    }, // end children
  }), // end customWidgetObject

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        accounts: [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Primary SMTP",
            channel: MessageChannel.EMAIL,
            provider: MessengerProvider.SMTP,
            status: MessengerAccountStatus.ACTIVE,
            healthStatus: MessengerHealthStatus.HEALTHY,
            isDefault: true,
            priority: 10,
            smtpFromEmail: "noreply@example.com",
            fromId: null,
            messagesSentTotal: 15000,
            lastUsedAt: "2024-01-07T11:45:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Twilio SMS",
            channel: MessageChannel.SMS,
            provider: MessengerProvider.TWILIO,
            status: MessengerAccountStatus.ACTIVE,
            healthStatus: MessengerHealthStatus.HEALTHY,
            isDefault: false,
            priority: 5,
            smtpFromEmail: null,
            fromId: "+1234567890",
            messagesSentTotal: 500,
            lastUsedAt: "2024-01-06T10:00:00.000Z",
            createdAt: "2024-01-02T00:00:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      },
    },
  },
});

export type MessengerAccountsListGETRequestInput =
  typeof GET.types.RequestInput;
export type MessengerAccountsListGETRequestOutput =
  typeof GET.types.RequestOutput;
export type MessengerAccountsListGETResponseInput =
  typeof GET.types.ResponseInput;
export type MessengerAccountsListGETResponseOutput =
  typeof GET.types.ResponseOutput;

const messengerAccountsListEndpoints = { GET };
export default messengerAccountsListEndpoints;
