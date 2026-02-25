/**
 * SMTP Accounts List API Definition
 * List SMTP accounts with filtering and pagination
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
import { scopedTranslation } from "./i18n";
import { SmtpAccountsListContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "smtp-client", "list"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  icon: "server",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: SmtpAccountsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS (Filters) ===
      campaignType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.campaignType.label",
        description: "fields.campaignType.description",
        columns: 3,
        options: CampaignTypeFilterOptions,
        schema: z.enum(CampaignTypeFilter).default(CampaignTypeFilter.ANY),
      }),

      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.status.label",
        description: "fields.status.description",
        columns: 3,
        options: SmtpAccountStatusFilterOptions,
        schema: z
          .enum(SmtpAccountStatusFilter)
          .default(SmtpAccountStatusFilter.ANY),
      }),

      healthStatus: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.healthStatus.label",
        description: "fields.healthStatus.description",
        columns: 3,
        options: SmtpHealthStatusFilterOptions,
        schema: z
          .enum(SmtpHealthStatusFilter)
          .default(SmtpHealthStatusFilter.ANY),
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

      sortBy: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortBy.label",
        description: "fields.sortBy.description",
        columns: 3,
        options: SmtpAccountSortFieldOptions,
        schema: z.enum(SmtpAccountSortField).optional(),
      }),

      sortOrder: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.sortOrder.label",
        description: "fields.sortOrder.description",
        columns: 3,
        options: SortOrderOptions,
        schema: z.enum(SortOrder).optional(),
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
        schema: z.coerce.number().int().min(1).max(100).default(10),
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
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.status",
              schema: z.enum(SmtpAccountStatus),
            }),
            healthCheckStatus: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.account.healthStatus",
              schema: z.enum(SmtpHealthStatus).nullable(),
            }),
            priority: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.priority",
              schema: z.coerce.number().int(),
            }),
            totalEmailsSent: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.account.totalEmailsSent",
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

  // === ERROR HANDLING ===
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

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
