/**
 * Leads List API Route Definition
 * Defines endpoint for listing leads with filtering and pagination
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
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
  LeadSortField,
  LeadSortFieldOptions,
  LeadSource,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadStatus,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

/**
 * Get Leads List Endpoint (GET)
 * Retrieves a paginated list of leads with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "list"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.leads.list.get.title" as const,
  description: "app.api.v1.core.leads.list.get.description" as const,
  category: "app.api.v1.core.leads.category" as const,
  tags: [
    "app.api.v1.core.leads.tags.leads" as const,
    "app.api.v1.core.leads.tags.management" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.list.get.form.title" as const,
      description: "app.api.v1.core.leads.list.get.form.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === SEARCH & PAGINATION ===
      searchPagination: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title:
            "app.api.v1.core.leads.list.get.searchPagination.title" as const,
          description:
            "app.api.v1.core.leads.list.get.searchPagination.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { request: "data" },
        {
          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.leads.list.get.search.label" as const,
              description:
                "app.api.v1.core.leads.list.get.search.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.search.placeholder" as const,
              layout: { columns: 8 },
            },
            z.string().optional(),
          ),
          page: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.leads.list.get.page.label" as const,
              description:
                "app.api.v1.core.leads.list.get.page.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.page.placeholder" as const,
              layout: { columns: 2 },
              validation: { min: 1 },
            },
            z.number().min(1).optional().default(1),
          ),
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.leads.list.get.limit.label" as const,
              description:
                "app.api.v1.core.leads.list.get.limit.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.limit.placeholder" as const,
              layout: { columns: 2 },
              validation: { min: 1, max: 100 },
            },
            z.number().min(1).max(100).optional().default(20),
          ),
        },
      ),

      // === STATUS & CAMPAIGN FILTERS ===
      statusFilters: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.leads.list.get.statusFilters.title" as const,
          description:
            "app.api.v1.core.leads.list.get.statusFilters.description" as const,
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.leads.list.get.status.label" as const,
              description:
                "app.api.v1.core.leads.list.get.status.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.status.placeholder" as const,
              options: LeadStatusFilterOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(LeadStatusFilter)).optional(),
          ),
          currentCampaignStage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.v1.core.leads.list.get.currentCampaignStage.label" as const,
              description:
                "app.api.v1.core.leads.list.get.currentCampaignStage.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.currentCampaignStage.placeholder" as const,
              options: EmailCampaignStageFilterOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(EmailCampaignStageFilter)).optional(),
          ),
          source: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.leads.list.get.source.label" as const,
              description:
                "app.api.v1.core.leads.list.get.source.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.source.placeholder" as const,
              options: LeadSourceFilterOptions,
              layout: { columns: 12 },
            },
            z.array(z.enum(LeadSourceFilter)).optional(),
          ),
        },
      ),

      // === LOCATION FILTERS ===
      locationFilters: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title:
            "app.api.v1.core.leads.list.get.locationFilters.title" as const,
          description:
            "app.api.v1.core.leads.list.get.locationFilters.description" as const,
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          country: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.leads.list.get.country.label" as const,
              description:
                "app.api.v1.core.leads.list.get.country.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.country.placeholder" as const,
              options: CountriesOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(Countries)).optional(),
          ),
          language: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.leads.list.get.language.label" as const,
              description:
                "app.api.v1.core.leads.list.get.language.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.language.placeholder" as const,
              options: LanguagesOptions,
              layout: { columns: 6 },
            },
            z.array(z.enum(Languages)).optional(),
          ),
        },
      ),

      // === SORTING OPTIONS ===
      sortingOptions: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.leads.list.get.sortingOptions.title" as const,
          description:
            "app.api.v1.core.leads.list.get.sortingOptions.description" as const,
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          sortBy: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.leads.list.get.sortBy.label" as const,
              description:
                "app.api.v1.core.leads.list.get.sortBy.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.sortBy.placeholder" as const,
              options: LeadSortFieldOptions,
              layout: { columns: 6 },
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
              label: "app.api.v1.core.leads.list.get.sortOrder.label" as const,
              description:
                "app.api.v1.core.leads.list.get.sortOrder.description" as const,
              placeholder:
                "app.api.v1.core.leads.list.get.sortOrder.placeholder" as const,
              options: SortOrderOptions,
              layout: { columns: 6 },
            },
            z.enum(SortOrder).optional().default(SortOrder.DESC),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.leads.list.get.response.title" as const,
          description:
            "app.api.v1.core.leads.list.get.response.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          leads: responseArrayField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "status",
              sortBy: "createdAt",
              showGroupSummary: true,
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.leads.list.get.response.leads.title" as const,
                description:
                  "app.api.v1.core.leads.list.get.response.leads.description" as const,
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.id" as const,
                  },
                  z.string(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.email" as const,
                  },
                  z.string().nullable(),
                ),
                businessName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.businessName" as const,
                  },
                  z.string(),
                ),
                contactName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.contactName" as const,
                  },
                  z.string().nullable(),
                ),
                phone: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.phone" as const,
                  },
                  z.string().nullable(),
                ),
                website: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.website" as const,
                  },
                  z.string().nullable(),
                ),
                country: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.country" as const,
                  },
                  z.enum(Countries),
                ),
                language: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.language" as const,
                  },
                  z.enum(Languages),
                ),
                status: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.status" as const,
                  },
                  z.enum(LeadStatus),
                ),
                source: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.source" as const,
                  },
                  z.enum(LeadSource).nullable(),
                ),
                notes: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.notes" as const,
                  },
                  z.string().nullable(),
                ),
                convertedUserId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.convertedUserId" as const,
                  },
                  z.string().nullable(),
                ),
                convertedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.convertedAt" as const,
                  },
                  z.date().nullable(),
                ),
                signedUpAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.signedUpAt" as const,
                  },
                  z.date().nullable(),
                ),
                consultationBookedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.consultationBookedAt" as const,
                  },
                  z.date().nullable(),
                ),
                subscriptionConfirmedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.subscriptionConfirmedAt" as const,
                  },
                  z.date().nullable(),
                ),
                currentCampaignStage: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.currentCampaignStage" as const,
                  },
                  z.enum(EmailCampaignStage).nullable(),
                ),
                emailsSent: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.emailsSent" as const,
                  },
                  z.number(),
                ),
                lastEmailSentAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.lastEmailSentAt" as const,
                  },
                  z.date().nullable(),
                ),
                unsubscribedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.unsubscribedAt" as const,
                  },
                  z.date().nullable(),
                ),
                emailsOpened: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.emailsOpened" as const,
                  },
                  z.number(),
                ),
                emailsClicked: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.emailsClicked" as const,
                  },
                  z.number(),
                ),
                lastEngagementAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.lastEngagementAt" as const,
                  },
                  z.date().nullable(),
                ),
                metadata: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.metadata" as const,
                  },
                  z.record(z.string(), z.any()),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.createdAt" as const,
                  },
                  z.date(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.leads.list.get.response.leads.updatedAt" as const,
                  },
                  z.date(),
                ),
              },
            ),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.leads.list.get.response.total" as const,
            },
            z.number(),
          ),
          page: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.leads.list.get.response.page" as const,
            },
            z.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.leads.list.get.response.limit" as const,
            },
            z.number(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.list.get.response.totalPages" as const,
            },
            z.number(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.list.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.leads.list.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.list.get.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.list.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.list.get.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.list.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.list.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.list.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.list.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.list.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.list.get.success.title" as const,
    description: "app.api.v1.core.leads.list.get.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        searchPagination: {
          page: 1,
          limit: 20,
        },
        statusFilters: {
          status: [LeadStatusFilter.ALL],
        },
        locationFilters: {
          country: [],
          language: [],
        },
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
      filtered: {
        searchPagination: {
          search: "example",
          page: 1,
          limit: 10,
        },
        statusFilters: {
          status: [LeadStatusFilter.NEW, LeadStatusFilter.PENDING],
          source: [LeadSourceFilter.WEBSITE],
          currentCampaignStage: [EmailCampaignStageFilter.INITIAL],
        },
        locationFilters: {
          country: [Countries.US, Countries.CA],
          language: [Languages.EN],
        },
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
      customSorting: {
        searchPagination: {
          page: 1,
          limit: 50,
        },
        statusFilters: {
          status: [LeadStatusFilter.SIGNED_UP],
        },
        locationFilters: {
          country: [],
          language: [],
        },
        sortingOptions: {
          sortBy: LeadSortField.UPDATED_AT,
          sortOrder: SortOrder.ASC,
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
          total: 100,
          page: 1,
          limit: 20,
          totalPages: 5,
        },
      },
      filtered: {
        response: {
          leads: [],
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
