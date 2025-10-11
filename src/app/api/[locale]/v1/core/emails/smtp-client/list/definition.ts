/**
 * SMTP Accounts List API Definition
 * List SMTP accounts with filtering and pagination
 */

import { z } from "zod";

import { EmailCampaignStage, EmailJourneyVariant } from "../../../leads/enum";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  requestResponseField,
  responseArrayField,
  responseField,
} from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "../../../user/user-roles/enum";
import { SortOrder, SortOrderOptions } from "../../messages/enum";
import {
  CampaignType,
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
  SmtpSecurityType,
} from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "smtp-client", "list"],
  title: "app.api.v1.core.emails.smtpClient.list.title",
  description: "app.api.v1.core.emails.smtpClient.list.description",
  category: "app.api.v1.core.emails.smtpClient.category",
  tags: ["app.api.v1.core.emails.smtpClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.smtpClient.list.container.title",
      description:
        "app.api.v1.core.emails.smtpClient.list.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: true, response: true },
    {
      // === REQUEST FIELDS (Filters) ===
      campaignType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.smtpClient.list.fields.campaignType.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.campaignType.description",
          layout: { columns: 3 },
          options: CampaignTypeFilterOptions,
        },
        z.nativeEnum(CampaignTypeFilter).optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.smtpClient.list.fields.status.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.status.description",
          layout: { columns: 3 },
          options: SmtpAccountStatusFilterOptions,
        },
        z.nativeEnum(SmtpAccountStatusFilter).optional(),
      ),

      healthStatus: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.smtpClient.list.fields.healthStatus.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.healthStatus.description",
          layout: { columns: 3 },
          options: SmtpHealthStatusFilterOptions,
        },
        z.nativeEnum(SmtpHealthStatusFilter).optional(),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smtpClient.list.fields.search.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.search.description",
          placeholder:
            "app.api.v1.core.emails.smtpClient.list.fields.search.placeholder",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.smtpClient.list.fields.sortBy.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.sortBy.description",
          layout: { columns: 3 },
          options: SmtpAccountSortFieldOptions,
        },
        z.nativeEnum(SmtpAccountSortField).optional(),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.smtpClient.list.fields.sortOrder.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.sortOrder.description",
          layout: { columns: 3 },
          options: SortOrderOptions,
        },
        z.nativeEnum(SortOrder).optional(),
      ),

      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.smtpClient.list.fields.page.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.page.description",
          layout: { columns: 3 },
        },
        z.coerce.number().int().min(1).optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.smtpClient.list.fields.limit.label",
          description:
            "app.api.v1.core.emails.smtpClient.list.fields.limit.description",
          layout: { columns: 3 },
        },
        z.coerce.number().int().min(1).max(100).optional(),
      ),

      // === RESPONSE FIELDS ===
      accounts: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          title:
            "app.api.v1.core.emails.smtpClient.list.response.accounts.title",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.emails.smtpClient.list.response.account.title",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.id",
              },
              z.uuid(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.name",
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.status",
              },
              z.nativeEnum(SmtpAccountStatus),
            ),
            healthCheckStatus: responseField(
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.healthStatus",
              },
              z.nativeEnum(SmtpHealthStatus).nullable(),
            ),
            priority: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.priority",
              },
              z.number().int(),
            ),
            totalEmailsSent: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.totalEmailsSent",
              },
              z.number().int(),
            ),
            lastUsedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.lastUsedAt",
              },
              z.string().datetime().nullable(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.smtpClient.list.response.account.createdAt",
              },
              z.string().datetime(),
            ),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.smtpClient.list.response.pagination.title",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.list.response.pagination.page",
            },
            z.number().int(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.list.response.pagination.limit",
            },
            z.number().int(),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.list.response.pagination.total",
            },
            z.number().int(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smtpClient.list.response.pagination.totalPages",
            },
            z.number().int(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.smtpClient.list.errors.validation.title",
      description:
        "app.api.v1.core.emails.smtpClient.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.smtpClient.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.smtpClient.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.list.errors.server.title",
      description:
        "app.api.v1.core.emails.smtpClient.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.smtpClient.list.errors.unknown.title",
      description:
        "app.api.v1.core.emails.smtpClient.list.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.smtpClient.list.success.title",
    description: "app.api.v1.core.emails.smtpClient.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        campaignType: CampaignTypeFilter.ALL,
        status: SmtpAccountStatusFilter.ACTIVE,
        page: 1,
        limit: 20,
      },
      filtered: {
        campaignType: CampaignTypeFilter.LEAD_CAMPAIGN,
        status: SmtpAccountStatusFilter.ACTIVE,
        search: "campaign",
        sortBy: SmtpAccountSortField.PRIORITY,
        sortOrder: SortOrder.DESC,
        page: 1,
        limit: 10,
      },
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
