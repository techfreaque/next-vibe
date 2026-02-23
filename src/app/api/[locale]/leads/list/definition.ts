/**
 * Leads List API Route Definition
 * Defines endpoint for listing leads with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedObjectFieldNew,
  scopedResponseArrayFieldNew,
  scopedResponseField,
  scopedWidgetField,
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
import { scopedTranslation } from "./i18n";
import { LeadsListContainer } from "./widget";

/**
 * Get Leads List Endpoint (GET)
 * Retrieves a paginated list of leads with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "list"],
  allowedRoles: [UserRole.ADMIN],

  title: "get.title",
  description: "get.description",
  category: "category",
  tags: ["tags.leads", "tags.management"],
  icon: "list",

  fields: customWidgetObject({
    render: LeadsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "get.title",
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

      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "get.actions.refresh",
        loadingText: "get.actions.refreshing",
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
        inline: true,
        usage: { request: "data", response: true },
      }),

      // Separator between buttons and content
      separator: scopedWidgetField(scopedTranslation, {
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
      formAlert: scopedWidgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 3.5,
        usage: { request: "data" },
      }),

      // === RESPONSE FIELDS ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title",
        description: "get.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        order: 4,
        usage: { response: true },
        children: {
          leads: scopedResponseArrayFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            columns: 12,
            child: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                email: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                businessName: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string(),
                }),
                contactName: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                country: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  label: "get.response.leads.country",
                  enumOptions: CountriesOptions,
                  schema: z.enum(Countries),
                }),
                language: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  label: "get.response.leads.language",
                  enumOptions: LanguagesOptions,
                  schema: z.enum(Languages),
                }),
                status: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  label: "get.response.leads.status",
                  enumOptions: LeadStatusOptions,
                  schema: z.enum(LeadStatus),
                }),
                source: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  label: "get.response.leads.source",
                  enumOptions: LeadSourceOptions,
                  schema: z.enum(LeadSource).nullable(),
                }),
                currentCampaignStage: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  label: "get.response.leads.currentCampaignStage",
                  enumOptions: EmailCampaignStageOptions,
                  schema: z.enum(EmailCampaignStage).nullable(),
                }),
                createdAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date(),
                }),
                phone: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                website: scopedResponseField(scopedTranslation, {
                  type: WidgetType.LINK,
                  schema: z.string().nullable(),
                }),
                notes: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                convertedUserId: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.string().nullable(),
                }),
                convertedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                signedUpAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                subscriptionConfirmedAt: scopedResponseField(
                  scopedTranslation,
                  {
                    type: WidgetType.TEXT,
                    fieldType: FieldDataType.DATETIME,
                    schema: z.coerce.date().nullable(),
                  },
                ),
                emailsSent: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                lastEmailSentAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                unsubscribedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                emailsOpened: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                emailsClicked: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.coerce.number(),
                }),
                lastEngagementAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date().nullable(),
                }),
                metadata: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.record(z.string(), z.any()),
                }),
                updatedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  fieldType: FieldDataType.DATETIME,
                  schema: z.coerce.date(),
                }),
                id: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  hidden: true,
                  schema: z.string(),
                }),
              },
            }),
          }),
        },
      }),

      // === PAGINATION INFO (Editable controls + display in one row) ===
      paginationInfo: paginationField({
        order: 5,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
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
