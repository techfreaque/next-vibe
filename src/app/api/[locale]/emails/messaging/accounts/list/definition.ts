/**
 * Messaging Accounts List API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../../shared/types/common.schema";
import { UserRole } from "../../../../user/user-roles/enum";
import {
  MessageChannel,
  MessageChannelFilter,
  MessageChannelFilterOptions,
  MessagingAccountStatus,
  MessagingAccountStatusDB,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { MessagingAccountsListContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "messaging", "accounts", "list"],
  title: "title",
  description: "description",
  category: "category",
  icon: "message-circle",
  tags: ["tags.messaging"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: MessagingAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      channel: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.channel.label",
        description: "fields.channel.description",
        columns: 3,
        options: MessageChannelFilterOptions,
        schema: z.enum(MessageChannelFilter).default(MessageChannelFilter.ANY),
      }),

      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.search.label",
        description: "fields.search.description",
        placeholder: "fields.search.placeholder",
        columns: 3,
        schema: z.string().optional(),
      }),

      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).max(100).default(20),
      }),

      // === RESPONSE FIELDS ===
      accounts: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "response.account.title",
          description: "response.account.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.id",
              schema: z.uuid(),
            }),
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.name",
              schema: z.string(),
            }),
            channel: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.channel",
              schema: z.enum(MessageChannel),
            }),
            provider: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.provider",
              schema: z.string(),
            }),
            fromId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.fromId",
              schema: z.string().nullable(),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.status",
              schema: z.enum(MessagingAccountStatusDB),
            }),
            messagesSentTotal: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.messagesSentTotal",
              schema: z.coerce.number().int(),
            }),
            lastUsedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.lastUsedAt",
              schema: dateSchema.nullable(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.createdAt",
              schema: dateSchema,
            }),
          },
        }),
      }),

      pagination: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.pagination.title",
        description: "response.pagination.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          page: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.page",
            schema: z.coerce.number().int(),
          }),
          limit: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.limit",
            schema: z.coerce.number().int(),
          }),
          total: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.total",
            schema: z.coerce.number().int(),
          }),
          totalPages: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.totalPages",
            schema: z.coerce.number().int(),
          }),
        },
      }),
    },
  }),

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
            name: "Twilio SMS",
            channel: MessageChannel.SMS,
            provider: "twilio",
            fromId: "+1234567890",
            status: MessagingAccountStatus.ACTIVE,
            messagesSentTotal: 500,
            lastUsedAt: "2024-01-07T11:45:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      },
    },
  },
});

export type MessagingAccountsListGETRequestInput =
  typeof GET.types.RequestInput;
export type MessagingAccountsListGETRequestOutput =
  typeof GET.types.RequestOutput;
export type MessagingAccountsListGETResponseInput =
  typeof GET.types.ResponseInput;
export type MessagingAccountsListGETResponseOutput =
  typeof GET.types.ResponseOutput;

const messagingAccountsListEndpoints = { GET };
export default messagingAccountsListEndpoints;
