/**
 * Campaign Starter Configuration API Route Definition
 * Defines endpoints for managing campaign starter configuration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import {
  CronTaskPriority,
  CronTaskPriorityOptions,
} from "../../../../system/unified-interface/tasks/enum";
import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { CampaignStarterConfigContainer } from "./widget";

/**
 * Get Campaign Starter Configuration Endpoint (GET)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "campaign-starter", "campaign-starter-config"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rocket",

  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.leads", "tags.campaigns"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.form.title",
    description: "get.form.description",
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      // Campaign settings
      dryRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.dryRun",
        schema: z.boolean(),
      }),
      minAgeHours: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.minAgeHours",
        schema: z.coerce.number().min(0).max(168),
      }),
      enabledDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.enabledDays",
        schema: z.array(z.coerce.number().min(1).max(7)),
      }),
      enabledHours: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.enabledHours",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          start: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.enabledHours",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().min(0).max(23),
          }),
          end: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.enabledHours",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number().min(0).max(23),
          }),
        },
      }),
      leadsPerWeek: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.leadsPerWeek",
        label: "post.leadsPerWeek.label",
        description: "post.leadsPerWeek.description",
        schema: z.record(z.string(), z.coerce.number().min(1)),
      }),
      // Cron settings
      schedule: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.schedule",
        schema: z.string().min(1),
      }),
      enabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.enabled",
        schema: z.boolean().default(true),
      }),
      priority: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.priority",
        schema: z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
      }),
      timeout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.timeout",
        schema: z.coerce.number().min(1000).max(3600000).default(300000),
      }),
      retries: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.retries",
        schema: z.coerce.number().min(0).max(10).default(3),
      }),
      retryDelay: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.retryDelay",
        schema: z.coerce.number().min(1000).max(300000).default(30000),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
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
    responses: {
      default: {
        dryRun: false,
        minAgeHours: 0,
        enabledDays: [1, 2, 3, 4, 5],
        enabledHours: {
          start: 7,
          end: 15,
        },
        leadsPerWeek: {
          "en-GLOBAL": 50,
          "de-DE": 50,
          "pl-PL": 30,
        },
        schedule: "*/3 * * * *",
        enabled: true,
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 30000,
      },
    },
  },
});

/**
 * Update Campaign Starter Configuration Endpoint (PUT)
 */
const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["leads", "campaigns", "campaign-starter", "campaign-starter-config"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rocket",

  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.leads", "tags.campaigns"],

  fields: customWidgetObject({
    render: CampaignStarterConfigContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // Request fields
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.dryRun.label",
        description: "post.dryRun.description",
        schema: z.boolean(),
      }),
      minAgeHours: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.minAgeHours.label",
        description: "post.minAgeHours.description",
        schema: z.coerce.number().min(0).max(168),
      }),
      enabledDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "post.enabledDays.label",
        description: "post.enabledDays.description",
        options: [
          {
            value: "1",
            label: "post.enabledDays.monday",
          },
          {
            value: "2",
            label: "post.enabledDays.tuesday",
          },
          {
            value: "3",
            label: "post.enabledDays.wednesday",
          },
          {
            value: "4",
            label: "post.enabledDays.thursday",
          },
          {
            value: "5",
            label: "post.enabledDays.friday",
          },
          {
            value: "6",
            label: "post.enabledDays.saturday",
          },
          {
            value: "7",
            label: "post.enabledDays.sunday",
          },
        ],
        schema: z.array(z.coerce.number().min(1).max(7)),
      }),
      enabledHours: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.enabledHours.label",
        description: "post.enabledHours.description",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          start: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "post.enabledHours.start.label",
            description: "post.enabledHours.start.description",
            schema: z.coerce.number().min(0).max(23),
          }),
          end: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "post.enabledHours.end.label",
            description: "post.enabledHours.end.description",
            schema: z.coerce.number().min(0).max(23),
          }),
        },
      }),
      schedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.schedule.label",
        description: "post.schedule.description",
        schema: z.string().min(1),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.enabled.label",
        description: "post.enabled.description",
        schema: z.boolean().default(true),
      }),
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.priority.label",
        description: "post.priority.description",
        options: CronTaskPriorityOptions,
        schema: z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.timeout.label",
        description: "post.timeout.description",
        schema: z.coerce.number().min(1000).max(3600000).default(300000),
      }),
      retries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.retries.label",
        description: "post.retries.description",
        schema: z.coerce.number().min(0).max(10).default(3),
      }),
      retryDelay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.retryDelay.label",
        description: "post.retryDelay.description",
        schema: z.coerce.number().min(1000).max(300000).default(30000),
      }),
      leadsPerWeek: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.leadsPerWeek.label",
        description: "post.leadsPerWeek.description",
        schema: z.record(z.string(), z.coerce.number().min(1)),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        dryRun: false,
        minAgeHours: 0,
        enabledDays: [1, 2, 3, 4, 5],
        enabledHours: {
          start: 7,
          end: 15,
        },
        leadsPerWeek: {
          "en-GLOBAL": 50,
          "de-DE": 50,
          "pl-PL": 30,
        },
        schedule: "*/3 * * * *",
        enabled: true,
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 30000,
      },
    },
  },
});

// Extract types using the new enhanced system
export type CampaignStarterConfigGetRequestInput =
  typeof GET.types.RequestInput;
export type CampaignStarterConfigGetRequestOutput =
  typeof GET.types.RequestOutput;
export type CampaignStarterConfigGetResponseInput =
  typeof GET.types.ResponseInput;
export type CampaignStarterConfigGetResponseOutput =
  typeof GET.types.ResponseOutput;

export type CampaignStarterConfigPutRequestInput =
  typeof PUT.types.RequestInput;
export type CampaignStarterConfigPutRequestOutput =
  typeof PUT.types.RequestOutput;
export type CampaignStarterConfigPutResponseInput =
  typeof PUT.types.ResponseInput;
export type CampaignStarterConfigPutResponseOutput =
  typeof PUT.types.ResponseOutput;

// oxlint-disable-next-line no-unused-vars
const _requestResponseMatchCheck: CampaignStarterConfigGetResponseOutput =
  {} as CampaignStarterConfigPutRequestOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
  PUT,
} as const;
export default definitions;
