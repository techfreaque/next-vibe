/**
 * Campaign Starter Configuration API Route Definition
 * Defines endpoints for managing campaign starter configuration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";

import {
  CronTaskPriority,
  CronTaskPriorityOptions,
} from "../../../../system/unified-interface/tasks/enum";
import { UserRole } from "../../../../user/user-roles/enum";

/**
 * Get Campaign Starter Configuration Endpoint (GET)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: [
    "v1",
    "core",
    "leads",
    "campaigns",
    "campaign-starter",
    "campaign-starter-config",
  ],
  allowedRoles: [UserRole.ADMIN],

  title:
    "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.title" as const,
  description:
    "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.description" as const,
  category: "app.api.v1.core.leads.campaigns.category" as const,
  tags: [
    "app.api.v1.core.leads.tags.leads" as const,
    "app.api.v1.core.leads.tags.campaigns" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.form.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.form.description" as const,
      layout: { type: LayoutType.STACKED },
      children: [],
    },
    { response: true },
    {
      // Response fields
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.title" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.description" as const,
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { response: true },
        {
          // Campaign settings
          dryRun: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.dryRun" as const,
            },
            z.boolean(),
          ),
          minAgeHours: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.minAgeHours" as const,
            },
            z.number().min(0).max(168),
          ),
          enabledDays: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabledDays" as const,
            },
            z.array(z.number().min(1).max(7)),
          ),
          enabledHours: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabledHours" as const,
            },
            z.object({
              start: z.number().min(0).max(23),
              end: z.number().min(0).max(23),
            }),
          ),
          leadsPerWeek: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.leadsPerWeek" as const,
            },
            z.record(z.string(), z.number().min(1)),
          ),
          // Cron settings
          schedule: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.schedule" as const,
            },
            z.string().min(1),
          ),
          enabled: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabled" as const,
            },
            z.boolean().default(true),
          ),
          priority: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.priority" as const,
            },
            z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
          ),
          timeout: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.timeout" as const,
            },
            z.number().min(1000).max(3600000).default(300000),
          ),
          retries: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.retries" as const,
            },
            z.number().min(0).max(10).default(3),
          ),
          retryDelay: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.retryDelay" as const,
            },
            z.number().min(1000).max(300000).default(30000),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.success.title" as const,
    description:
      "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.success.description" as const,
  },
  examples: {
    responses: {
      default: {
        response: {
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
  },
});

/**
 * Update Campaign Starter Configuration Endpoint (PUT)
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: [
    "v1",
    "core",
    "leads",
    "campaigns",
    "campaign-starter",
    "campaign-starter-config",
  ],
  allowedRoles: [UserRole.ADMIN],

  title:
    "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.title" as const,
  description:
    "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.description" as const,
  category: "app.api.v1.core.leads.campaigns.category" as const,
  tags: [
    "app.api.v1.core.leads.tags.leads" as const,
    "app.api.v1.core.leads.tags.campaigns" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.form.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.form.description" as const,
      layout: { type: LayoutType.STACKED },
      children: [],
    },
    { request: "data", response: true },
    {
      // Request fields
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.dryRun.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.dryRun.description" as const,
        },
        z.boolean(),
      ),
      minAgeHours: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.minAgeHours.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.minAgeHours.description" as const,
          validation: { min: 0, max: 168 },
        },
        z.number().min(0).max(168),
      ),
      enabledDays: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.description" as const,
          options: [
            {
              value: "1",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.monday" as const,
            },
            {
              value: "2",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.tuesday" as const,
            },
            {
              value: "3",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.wednesday" as const,
            },
            {
              value: "4",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.thursday" as const,
            },
            {
              value: "5",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.friday" as const,
            },
            {
              value: "6",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.saturday" as const,
            },
            {
              value: "7",
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledDays.sunday" as const,
            },
          ],
        },
        z.array(z.number().min(1).max(7)),
      ),
      enabledHours: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
          children: [],
        },
        { request: "data" },
        {
          start: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.start.label" as const,
              description:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.start.description" as const,
              validation: { min: 0, max: 23 },
            },
            z.number().min(0).max(23),
          ),
          end: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.end.label" as const,
              description:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabledHours.end.description" as const,
              validation: { min: 0, max: 23 },
            },
            z.number().min(0).max(23),
          ),
        },
      ),
      schedule: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.schedule.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.schedule.description" as const,
        },
        z.string().min(1),
      ),
      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabled.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.enabled.description" as const,
        },
        z.boolean().default(true),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.priority.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.priority.description" as const,
          options: CronTaskPriorityOptions,
        },
        z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
      ),
      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.timeout.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.timeout.description" as const,
          validation: { min: 1000, max: 3600000 },
        },
        z.number().min(1000).max(3600000).default(300000),
      ),
      retries: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.retries.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.retries.description" as const,
          validation: { min: 0, max: 10 },
        },
        z.number().min(0).max(10).default(3),
      ),
      retryDelay: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.retryDelay.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.retryDelay.description" as const,
          validation: { min: 1000, max: 300000 },
        },
        z.number().min(1000).max(300000).default(30000),
      ),
      leadsPerWeek: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.leadsPerWeek.label" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.leadsPerWeek.description" as const,
        },
        z.record(z.string(), z.number().min(1)),
      ),
      // Response fields (same structure as GET)
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.response.title" as const,
          description:
            "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.response.description" as const,
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { response: true },
        {
          dryRun: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.dryRun" as const,
            },
            z.boolean(),
          ),
          minAgeHours: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.minAgeHours" as const,
            },
            z.number().min(0).max(168),
          ),
          enabledDays: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabledDays" as const,
            },
            z.array(z.number().min(1).max(7)),
          ),
          enabledHours: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabledHours" as const,
            },
            z.object({
              start: z.number().min(0).max(23),
              end: z.number().min(0).max(23),
            }),
          ),
          leadsPerWeek: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.leadsPerWeek" as const,
            },
            z.record(z.string(), z.number().min(1)),
          ),
          schedule: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.schedule" as const,
            },
            z.string().min(1),
          ),
          enabled: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.enabled" as const,
            },
            z.boolean().default(true),
          ),
          priority: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.priority" as const,
            },
            z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
          ),
          timeout: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.timeout" as const,
            },
            z.number().min(1000).max(3600000).default(300000),
          ),
          retries: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.retries" as const,
            },
            z.number().min(0).max(10).default(3),
          ),
          retryDelay: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.get.response.retryDelay" as const,
            },
            z.number().min(1000).max(300000).default(30000),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.success.title" as const,
    description:
      "app.api.v1.core.leads.campaigns.campaignStarter.campaignStarterConfig.post.success.description" as const,
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
    responses: {
      default: {
        response: {
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

// Legacy type alias for backwards compatibility
export type CampaignStarterConfigType =
  CampaignStarterConfigGetResponseOutput["response"];

/**
 * Export definitions
 */
const definitions = {
  GET,
  PUT,
};

export { GET, PUT };
export default definitions;
