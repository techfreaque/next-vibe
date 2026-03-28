/**
 * Campaign Starter API Definition
 * POST: save config + run, GET: read config
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
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CampaignStarterConfigContainer } from "./widget";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "campaign-starter"],
  aliases: ["campaign-starter"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.leadsCampaigns",
  icon: "play",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignStarterConfigContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // Hidden field — browser timezone, defaulted client-side automatically
      timezone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.timezone.label",
        description: "post.fields.timezone.description",
        schema: z
          .string()
          .optional()
          .default(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
      }),
      // Run-specific fields
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.dryRun.label",
        description: "put.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      // Config fields
      minAgeHours: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.minAgeHours.label",
        description: "put.minAgeHours.description",
        schema: z.coerce.number().min(0).max(168),
      }),
      localeConfig: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "put.localeConfig.label",
        description: "put.localeConfig.description",
        schema: z.record(
          z.string(),
          z.object({
            leadsPerWeek: z.coerce.number().min(1),
            enabledDays: z.array(z.coerce.number().min(1).max(7)),
            enabledHours: z.object({
              start: z.coerce.number().min(0).max(23),
              end: z.coerce.number().min(0).max(23),
            }),
          }),
        ),
      }),
      schedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.schedule.label",
        description: "put.schedule.description",
        schema: z.string().min(1),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.enabled.label",
        description: "put.enabled.description",
        schema: z.boolean().default(true),
      }),
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.priority.label",
        description: "put.priority.description",
        options: CronTaskPriorityOptions,
        schema: z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.timeout.label",
        description: "put.timeout.description",
        schema: z.coerce.number().min(1000).max(3600000).default(300000),
      }),
      retries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.retries.label",
        description: "put.retries.description",
        schema: z.coerce.number().min(0).max(10).default(3),
      }),
      retryDelay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.retryDelay.label",
        description: "put.retryDelay.description",
        schema: z.coerce.number().min(1000).max(300000).default(30000),
      }),
      backButton: backButton(scopedTranslation, {
        usage: { request: "data" },
      }),
      // Response fields
      leadsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsProcessed",
        schema: z.number(),
      }),
      leadsStarted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsStarted",
        schema: z.number(),
      }),
      leadsSkipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsSkipped",
        schema: z.number(),
      }),
      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.executionTimeMs",
        schema: z.number(),
      }),
      errors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.errors",
        description: "post.response.errors",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            leadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              schema: z.string(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              schema: z.string(),
            }),
            error: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              schema: z.string(),
            }),
          },
        }),
      }),
      quotaDetails: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.quotaDetails",
        description: "post.response.quotaDetails",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            locale: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.string(),
            }),
            weeklyQuota: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
            leadsStartedThisWeek: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
            remainingQuota: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
            totalRunsPerWeek: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
            perRunBudget: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
            dispatched: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.quotaDetails",
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        timezone: "UTC",
        dryRun: false,
        force: false,
        minAgeHours: 0,
        localeConfig: {
          "en-GLOBAL": {
            leadsPerWeek: 50,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
          "de-DE": {
            leadsPerWeek: 50,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
          "pl-PL": {
            leadsPerWeek: 30,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
        },
        schedule: "*/3 * * * *",
        enabled: true,
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 30000,
      },
    },
    responses: {
      default: {
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: 0,
        errors: [],
        quotaDetails: [],
      },
    },
  },
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "campaign-starter"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rocket",
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.leadsCampaigns",
  tags: ["tag"],

  fields: customWidgetObject({
    render: CampaignStarterConfigContainer,
    usage: { request: "data", response: true } as const,
    children: {
      timezone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.timezone.label",
        description: "get.fields.timezone.description",
        schema: z
          .string()
          .optional()
          .default(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
      }),
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
      localeConfig: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.localeConfig",
        schema: z.record(
          z.string(),
          z.object({
            leadsPerWeek: z.coerce.number().min(0),
            enabledDays: z.array(z.coerce.number().min(1).max(7)),
            enabledHours: z.object({
              start: z.coerce.number().min(0).max(23),
              end: z.coerce.number().min(0).max(23),
            }),
          }),
        ),
      }),
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        timezone: "UTC",
      },
    },
    responses: {
      default: {
        dryRun: false,
        minAgeHours: 0,
        localeConfig: {
          "en-GLOBAL": {
            leadsPerWeek: 50,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
          "de-DE": {
            leadsPerWeek: 50,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
          "pl-PL": {
            leadsPerWeek: 30,
            enabledDays: [1, 2, 3, 4, 5],
            enabledHours: { start: 7, end: 15 },
          },
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

export type CampaignStarterPostRequestOutput = typeof POST.types.RequestOutput;
export type CampaignStarterPostResponseOutput =
  typeof POST.types.ResponseOutput;
export type CampaignStarterConfigGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type CampaignStarterConfigPutRequestOutput =
  CampaignStarterPostRequestOutput;
export type CampaignStarterConfigPutResponseOutput =
  CampaignStarterPostResponseOutput;

const definitions = { POST, GET };
export default definitions;
