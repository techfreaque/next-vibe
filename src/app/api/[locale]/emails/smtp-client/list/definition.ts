/**
 * SMTP Accounts List API Definition
 * List SMTP accounts with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../shared/types/common.schema";
import { UserRole } from "../../../user/user-roles/enum";
import { SortOrder, SortOrderOptions } from "../../messages/enum";
import {
  CampaignTypeFilter,
  CampaignTypeFilterOptions,
  SmtpAccountSortField,
  SmtpAccountSortFieldOptions,
  SmtpAccountStatus,
  SmtpAccountStatusFilter,
  SmtpAccountStatusFilterOptions,
  SmtpHealthStatus,
  SmtpHealthStatusFilter,
  SmtpHealthStatusFilterOptions,
} from "../enum";
import { SmtpAccountsListContainer } from "./widget";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "smtp-client", "list"],
  title: "app.api.emails.smtpClient.list.title",
  description: "app.api.emails.smtpClient.list.description",
  category: "app.api.emails.smtpClient.category",
  icon: "server",
  tags: ["app.api.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SmtpAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === REQUEST FIELDS (Filters) ===
      campaignType: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.list.fields.campaignType.label",
        description:
          "app.api.emails.smtpClient.list.fields.campaignType.description",
        columns: 3,
        options: CampaignTypeFilterOptions,
        schema: z.enum(CampaignTypeFilter).default(CampaignTypeFilter.ANY),
      }),

      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.list.fields.status.label",
        description: "app.api.emails.smtpClient.list.fields.status.description",
        columns: 3,
        options: SmtpAccountStatusFilterOptions,
        schema: z
          .enum(SmtpAccountStatusFilter)
          .default(SmtpAccountStatusFilter.ANY),
      }),

      healthStatus: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.list.fields.healthStatus.label",
        description:
          "app.api.emails.smtpClient.list.fields.healthStatus.description",
        columns: 3,
        options: SmtpHealthStatusFilterOptions,
        schema: z
          .enum(SmtpHealthStatusFilter)
          .default(SmtpHealthStatusFilter.ANY),
      }),

      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.smtpClient.list.fields.search.label",
        description: "app.api.emails.smtpClient.list.fields.search.description",
        placeholder: "app.api.emails.smtpClient.list.fields.search.placeholder",
        columns: 3,
        schema: z.string().optional(),
      }),

      sortBy: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.list.fields.sortBy.label",
        description: "app.api.emails.smtpClient.list.fields.sortBy.description",
        columns: 3,
        options: SmtpAccountSortFieldOptions,
        schema: z.enum(SmtpAccountSortField).optional(),
      }),

      sortOrder: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.smtpClient.list.fields.sortOrder.label",
        description:
          "app.api.emails.smtpClient.list.fields.sortOrder.description",
        columns: 3,
        options: SortOrderOptions,
        schema: z.enum(SortOrder).optional(),
      }),

      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.smtpClient.list.fields.page.label",
        description: "app.api.emails.smtpClient.list.fields.page.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).default(1),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.smtpClient.list.fields.limit.label",
        description: "app.api.emails.smtpClient.list.fields.limit.description",
        columns: 3,
        schema: z.coerce.number().int().min(1).max(100).default(10),
      }),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.emails.smtpClient.list.response.account.title",
            description:
              "app.api.emails.smtpClient.list.response.account.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content: "app.api.emails.smtpClient.list.response.account.id",
              schema: z.uuid(),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              content: "app.api.emails.smtpClient.list.response.account.name",
              schema: z.string(),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.smtpClient.list.response.account.status",
              schema: z.enum(SmtpAccountStatus),
            }),
            healthCheckStatus: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.smtpClient.list.response.account.healthStatus",
              schema: z.enum(SmtpHealthStatus).nullable(),
            }),
            priority: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.smtpClient.list.response.account.priority",
              schema: z.coerce.number().int(),
            }),
            totalEmailsSent: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.smtpClient.list.response.account.totalEmailsSent",
              schema: z.coerce.number().int(),
            }),
            lastUsedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.smtpClient.list.response.account.lastUsedAt",
              schema: dateSchema.nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.smtpClient.list.response.account.createdAt",
              schema: z.string().datetime(),
            }),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.smtpClient.list.response.pagination.title",
          description:
            "app.api.emails.smtpClient.list.response.pagination.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          page: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.smtpClient.list.response.pagination.page",
            schema: z.coerce.number().int(),
          }),
          limit: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.smtpClient.list.response.pagination.limit",
            schema: z.coerce.number().int(),
          }),
          total: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.smtpClient.list.response.pagination.total",
            schema: z.coerce.number().int(),
          }),
          totalPages: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.smtpClient.list.response.pagination.totalPages",
            schema: z.coerce.number().int(),
          }),
        },
      ),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.smtpClient.list.errors.validation.title",
      description:
        "app.api.emails.smtpClient.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.smtpClient.list.errors.unauthorized.title",
      description:
        "app.api.emails.smtpClient.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.smtpClient.list.errors.forbidden.title",
      description:
        "app.api.emails.smtpClient.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.smtpClient.list.errors.notFound.title",
      description: "app.api.emails.smtpClient.list.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.smtpClient.list.errors.conflict.title",
      description: "app.api.emails.smtpClient.list.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.smtpClient.list.errors.server.title",
      description: "app.api.emails.smtpClient.list.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.smtpClient.list.errors.networkError.title",
      description:
        "app.api.emails.smtpClient.list.errors.networkError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.smtpClient.list.errors.unsavedChanges.title",
      description:
        "app.api.emails.smtpClient.list.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.smtpClient.list.errors.unknown.title",
      description: "app.api.emails.smtpClient.list.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.smtpClient.list.success.title",
    description: "app.api.emails.smtpClient.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        accounts: [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "Primary Campaign SMTP",
            status: SmtpAccountStatus.ACTIVE,
            healthCheckStatus: SmtpHealthStatus.HEALTHY,
            priority: 10,
            totalEmailsSent: 15000,
            lastUsedAt: "2024-01-07T11:45:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    },
  },
});

export type SmtpAccountsListGETRequestInput = typeof GET.types.RequestInput;
export type SmtpAccountsListGETRequestOutput = typeof GET.types.RequestOutput;
export type SmtpAccountsListGETResponseInput = typeof GET.types.ResponseInput;
export type SmtpAccountsListGETResponseOutput = typeof GET.types.ResponseOutput;

const smtpAccountsListEndpoints = { GET };
export default smtpAccountsListEndpoints;
