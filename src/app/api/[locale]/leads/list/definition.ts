/**
 * Leads List API Route Definition
 * Defines endpoint for listing leads with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestDataField,
  requestResponseField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { UserRole } from "../../user/user-roles/enum";
import {
  EmailCampaignStage,
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailCampaignStageOptions,
  LeadSortField,
  LeadSortFieldOptions,
  LeadSource,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  LeadStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

/**
 * Get Leads List Endpoint (GET)
 * Retrieves a paginated list of leads with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["leads", "list"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.leads.list.get.title" as const,
  description: "app.api.leads.list.get.description" as const,
  category: "app.api.leads.category" as const,
  tags: [
    "app.api.leads.tags.leads" as const,
    "app.api.leads.tags.management" as const,
  ],
  icon: "list",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.list.get.form.title" as const,
      description: "app.api.leads.list.get.form.description" as const,
      layoutType: LayoutType.STACKED,
      getCount: (data) => data.response?.paginationInfo?.total,
      submitButton: {
        text: "app.api.leads.list.get.actions.refresh" as const,
        loadingText: "app.api.leads.list.get.actions.refreshing" as const,
        position: "header",
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
      },
    },
    { request: "data", response: true },
    {
      // === STATUS & CAMPAIGN FILTERS (with Search) ===
      statusFilters: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.list.get.statusFilters.title" as const,
          description:
            "app.api.leads.list.get.statusFilters.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
          order: 1,
        },
        { request: "data" },
        {
          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.leads.list.get.search.label" as const,
              description: "app.api.leads.list.get.search.description" as const,
              placeholder: "app.api.leads.list.get.search.placeholder" as const,
              columns: 12,
            },
            z.string().optional(),
          ),
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.leads.list.get.status.label" as const,
              description: "app.api.leads.list.get.status.description" as const,
              placeholder: "app.api.leads.list.get.status.placeholder" as const,
              options: LeadStatusFilterOptions,
              columns: 6,
            },
            z.array(z.enum(LeadStatusFilter)).optional(),
          ),
          currentCampaignStage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.leads.list.get.currentCampaignStage.label" as const,
              description:
                "app.api.leads.list.get.currentCampaignStage.description" as const,
              placeholder:
                "app.api.leads.list.get.currentCampaignStage.placeholder" as const,
              options: EmailCampaignStageFilterOptions,
              columns: 6,
            },
            z.array(z.enum(EmailCampaignStageFilter)).optional(),
          ),
          source: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.leads.list.get.source.label" as const,
              description: "app.api.leads.list.get.source.description" as const,
              placeholder: "app.api.leads.list.get.source.placeholder" as const,
              options: LeadSourceFilterOptions,
              columns: 12,
            },
            z.array(z.enum(LeadSourceFilter)).optional(),
          ),
        },
      ),

      // === LOCATION FILTERS ===
      locationFilters: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.list.get.locationFilters.title" as const,
          description:
            "app.api.leads.list.get.locationFilters.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 2,
        },
        { request: "data" },
        {
          country: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.leads.list.get.country.label" as const,
              description:
                "app.api.leads.list.get.country.description" as const,
              placeholder:
                "app.api.leads.list.get.country.placeholder" as const,
              options: CountriesOptions,
              columns: 6,
            },
            z.array(z.enum(Countries)).optional(),
          ),
          language: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.leads.list.get.language.label" as const,
              description:
                "app.api.leads.list.get.language.description" as const,
              placeholder:
                "app.api.leads.list.get.language.placeholder" as const,
              options: LanguagesOptions,
              columns: 6,
            },
            z.array(z.enum(Languages)).optional(),
          ),
        },
      ),

      // === SORTING OPTIONS ===
      sortingOptions: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.list.get.sortingOptions.title" as const,
          description:
            "app.api.leads.list.get.sortingOptions.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 3,
        },
        { request: "data" },
        {
          sortBy: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.leads.list.get.sortBy.label" as const,
              description: "app.api.leads.list.get.sortBy.description" as const,
              placeholder: "app.api.leads.list.get.sortBy.placeholder" as const,
              options: LeadSortFieldOptions,
              columns: 6,
            },
            z
              .nativeEnum(LeadSortField)
              .optional()
              .default(LeadSortField.CREATED_AT),
          ),
          sortOrder: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.leads.list.get.sortOrder.label" as const,
              description:
                "app.api.leads.list.get.sortOrder.description" as const,
              placeholder:
                "app.api.leads.list.get.sortOrder.placeholder" as const,
              options: SortOrderOptions,
              columns: 6,
            },
            z.enum(SortOrder).optional().default(SortOrder.DESC),
          ),
        },
      ),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField(
        {
          type: WidgetType.FORM_ALERT,
          order: 3.5,
        },
        { request: "data" },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.list.get.response.title" as const,
          description: "app.api.leads.list.get.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
          order: 4,
        },
        { response: true },
        {
          leads: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
              columns: 12,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.email" as const,
                  },
                  z.string().nullable(),
                ),
                businessName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.businessName" as const,
                  },
                  z.string(),
                ),
                contactName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.contactName" as const,
                  },
                  z.string().nullable(),
                ),
                country: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.list.get.response.leads.country" as const,
                    enumOptions: CountriesOptions,
                  },
                  z.enum(Countries),
                ),
                language: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.list.get.response.leads.language" as const,
                    enumOptions: LanguagesOptions,
                  },
                  z.enum(Languages),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.list.get.response.leads.status" as const,
                    enumOptions: LeadStatusOptions,
                  },
                  z.enum(LeadStatus),
                ),
                source: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.list.get.response.leads.source" as const,
                    enumOptions: LeadSourceOptions,
                  },
                  z.enum(LeadSource).nullable(),
                ),
                currentCampaignStage: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.list.get.response.leads.currentCampaignStage" as const,
                    enumOptions: EmailCampaignStageOptions,
                  },
                  z.enum(EmailCampaignStage).nullable(),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.createdAt" as const,
                  },
                  z.coerce.date(),
                ),
                phone: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.phone" as const,
                  },
                  z.string().nullable(),
                ),
                website: responseField(
                  {
                    type: WidgetType.LINK,
                    href: "app.api.leads.list.get.response.leads.website" as const,
                  },
                  z.string().nullable(),
                ),
                notes: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.notes" as const,
                  },
                  z.string().nullable(),
                ),
                convertedUserId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.convertedUserId" as const,
                  },
                  z.string().nullable(),
                ),
                convertedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.convertedAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                signedUpAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.signedUpAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                consultationBookedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.consultationBookedAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                subscriptionConfirmedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.subscriptionConfirmedAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                emailsSent: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.emailsSent" as const,
                  },
                  z.coerce.number(),
                ),
                lastEmailSentAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.lastEmailSentAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                unsubscribedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.unsubscribedAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                emailsOpened: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.emailsOpened" as const,
                  },
                  z.coerce.number(),
                ),
                emailsClicked: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.emailsClicked" as const,
                  },
                  z.coerce.number(),
                ),
                lastEngagementAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.lastEngagementAt" as const,
                  },
                  z.coerce.date().nullable(),
                ),
                metadata: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.metadata" as const,
                  },
                  z.record(z.string(), z.any()),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    content:
                      "app.api.leads.list.get.response.leads.updatedAt" as const,
                  },
                  z.coerce.date(),
                ),
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.leads.list.get.response.leads.id" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),

      // === PAGINATION INFO (Editable controls + display in one row) ===
      paginationInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.HORIZONTAL,
          noCard: true,
          gap: "4",
          order: 5,
        },
        { request: "data", response: true },
        {
          page: requestResponseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.leads.list.get.page.label" as const,
              columns: 3,
            },
            z.coerce.number().optional().default(1),
          ),
          limit: requestResponseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.leads.list.get.limit.label" as const,
              columns: 3,
            },
            z.coerce.number().optional().default(20),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              label: "app.api.leads.list.get.response.total" as const,
              content: "app.api.leads.list.get.response.total" as const,
              columns: 3,
            },
            z.coerce.number(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              label: "app.api.leads.list.get.response.totalPages" as const,
              content: "app.api.leads.list.get.response.totalPages" as const,
              columns: 3,
            },
            z.coerce.number(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.list.get.errors.unauthorized.title" as const,
      description:
        "app.api.leads.list.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.list.get.errors.validation.title" as const,
      description:
        "app.api.leads.list.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.list.get.errors.server.title" as const,
      description: "app.api.leads.list.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.list.get.errors.unknown.title" as const,
      description: "app.api.leads.list.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.list.get.errors.network.title" as const,
      description: "app.api.leads.list.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.list.get.errors.forbidden.title" as const,
      description:
        "app.api.leads.list.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.list.get.errors.notFound.title" as const,
      description:
        "app.api.leads.list.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.list.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.leads.list.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.list.get.errors.conflict.title" as const,
      description:
        "app.api.leads.list.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.leads.list.get.success.title" as const,
    description: "app.api.leads.list.get.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
        paginationInfo: {
          page: 1,
          limit: 20,
        },
      },
      filtered: {
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
        paginationInfo: {
          page: 1,
          limit: 10,
        },
      },
      customSorting: {
        sortingOptions: {
          sortBy: LeadSortField.BUSINESS_NAME,
          sortOrder: SortOrder.ASC,
        },
        paginationInfo: {
          page: 1,
          limit: 50,
        },
      },
    },
    responses: {
      default: {
        response: {
          leads: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              email: "john@example.com",
              businessName: "Example Corp",
              contactName: "John Doe",
              phone: "+1234567890",
              website: "https://example.com",
              country: Countries.GLOBAL,
              language: Languages.EN,
              status: LeadStatus.NEW,
              source: LeadSource.WEBSITE,
              notes: "Interested in premium features",
              convertedUserId: null,
              convertedAt: null,
              signedUpAt: null,
              consultationBookedAt: null,
              subscriptionConfirmedAt: null,
              currentCampaignStage: null,
              emailsSent: 0,
              lastEmailSentAt: null,
              unsubscribedAt: null,
              emailsOpened: 0,
              emailsClicked: 0,
              lastEngagementAt: null,
              metadata: {},
              createdAt: new Date("2023-01-01T00:00:00.000Z"),
              updatedAt: new Date("2023-01-01T00:00:00.000Z"),
            },
          ],
        },
        paginationInfo: {
          total: 100,
          page: 1,
          limit: 20,
          totalPages: 5,
        },
      },
      filtered: {
        response: {
          leads: [],
        },
        paginationInfo: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      },
      customSorting: {
        response: {
          leads: [
            {
              id: "123e4567-e89b-12d3-a456-426614174001",
              email: "jane@startup.com",
              businessName: "Startup Inc",
              contactName: "Jane Smith",
              phone: "+9876543210",
              website: "https://startup.example.com",
              country: Countries.GLOBAL,
              language: Languages.EN,
              status: LeadStatus.SIGNED_UP,
              source: LeadSource.REFERRAL,
              notes: null,
              convertedUserId: "user-123",
              convertedAt: new Date("2023-06-01T00:00:00.000Z"),
              signedUpAt: new Date("2023-05-15T00:00:00.000Z"),
              consultationBookedAt: null,
              subscriptionConfirmedAt: null,
              currentCampaignStage: EmailCampaignStage.FOLLOWUP_1,
              emailsSent: 3,
              lastEmailSentAt: new Date("2023-05-20T00:00:00.000Z"),
              unsubscribedAt: null,
              emailsOpened: 2,
              emailsClicked: 1,
              lastEngagementAt: new Date("2023-05-21T00:00:00.000Z"),
              metadata: {},
              createdAt: new Date("2023-05-01T00:00:00.000Z"),
              updatedAt: new Date("2023-06-01T00:00:00.000Z"),
            },
          ],
        },
        paginationInfo: {
          total: 25,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type LeadListGetRequestTypeInput = typeof GET.types.RequestInput;
export type LeadListGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type LeadListGetResponseTypeInput = typeof GET.types.ResponseInput;
export type LeadListGetResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export { GET };
export default definitions;
