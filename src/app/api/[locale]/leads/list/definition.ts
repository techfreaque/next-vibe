/**
 * Leads List API Route Definition
 * Defines endpoint for listing leads with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { paginationField } from "../../system/unified-interface/unified-ui/widgets/containers/pagination/types";
import { UserRole } from "../../user/user-roles/enum";
import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSortField,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
  SortOrder,
} from "../enum";
import {
  leadsLocationFiltersContainer,
  leadsSortingOptionsContainer,
  leadsStatusFiltersContainer,
} from "../shared-filter-fields";
import { LeadsListContainer } from "./widget";

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

  fields: customWidgetObject({
    render: LeadsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      title: widgetField({
        type: WidgetType.TITLE,
        content: "app.api.leads.list.get.title" as const,
        getCount: (responseData: {
          data?: { paginationInfo?: { total?: number } };
        }) => responseData?.data?.paginationInfo?.total,
        className: "mr-auto",
        usage: { request: "data", response: true },
        inline: true,
      }),

      backButton: backButton({
        usage: { request: "data", response: true },
        inline: true,
      }),

      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "app.api.leads.list.get.actions.refresh" as const,
        loadingText: "app.api.leads.list.get.actions.refreshing" as const,
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
        inline: true,
        usage: { request: "data", response: true },
      }),

      // Separator between buttons and content
      separator: widgetField({
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { request: "data", response: true },
      }),

      // === STATUS & CAMPAIGN FILTERS (with Search) ===
      statusFilters: leadsStatusFiltersContainer,

      // === LOCATION FILTERS ===
      locationFilters: leadsLocationFiltersContainer,

      // === SORTING OPTIONS ===
      sortingOptions: leadsSortingOptionsContainer,

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        order: 3.5,
        usage: { request: "data" },
      }),

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
              type: WidgetType.CONTAINER,
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
                email: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                businessName: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string(),
                }),
                contactName: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                country: responseField({
                  type: WidgetType.BADGE,
                  label:
                    "app.api.leads.list.get.response.leads.country" as const,
                  enumOptions: CountriesOptions,
                  schema: z.enum(Countries),
                }),
                language: responseField({
                  type: WidgetType.BADGE,
                  label:
                    "app.api.leads.list.get.response.leads.language" as const,
                  enumOptions: LanguagesOptions,
                  schema: z.enum(Languages),
                }),
                status: responseField({
                  type: WidgetType.BADGE,
                  label:
                    "app.api.leads.list.get.response.leads.status" as const,
                  enumOptions: LeadStatusOptions,
                  schema: z.enum(LeadStatus),
                }),
                source: responseField({
                  type: WidgetType.BADGE,
                  label:
                    "app.api.leads.list.get.response.leads.source" as const,
                  enumOptions: LeadSourceOptions,
                  schema: z.enum(LeadSource).nullable(),
                }),
                currentCampaignStage: responseField({
                  type: WidgetType.BADGE,
                  label:
                    "app.api.leads.list.get.response.leads.currentCampaignStage" as const,
                  enumOptions: EmailCampaignStageOptions,
                  schema: z.enum(EmailCampaignStage).nullable(),
                }),
                createdAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date(),
                }),
                phone: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                website: responseField({
                  type: WidgetType.LINK,
                  schema: z.string().nullable(),
                }),
                notes: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                convertedUserId: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                convertedAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                signedUpAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                subscriptionConfirmedAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                emailsSent: responseField({
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                lastEmailSentAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                unsubscribedAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                emailsOpened: responseField({
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                emailsClicked: responseField({
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                lastEngagementAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                metadata: responseField({
                  type: WidgetType.TEXT,
                  schema: z.record(z.string(), z.any()),
                }),
                updatedAt: responseField({
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date(),
                }),
                id: responseField({
                  type: WidgetType.TEXT,
                  hidden: true,
                  schema: z.string(),
                }),
              },
            ),
          ),
        },
      ),

      // === PAGINATION INFO (Editable controls + display in one row) ===
      paginationInfo: paginationField({
        order: 5,
      }),
    },
  }),

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
          totalCount: 100,
          pageCount: 5,
        },
      },
      filtered: {
        response: {
          leads: [],
        },
        paginationInfo: {
          totalCount: 0,
          pageCount: 0,
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
          totalCount: 25,
          pageCount: 1,
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
} as const;
export default definitions;
