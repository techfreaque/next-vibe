/**
 * Bounce Processor API Definition
 * POST: run + save config, GET: read config
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseField,
  submitButton,
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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { BOUNCE_PROCESSOR_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
const BounceProcessorConfigWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BounceProcessorConfigWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "bounce-processor"],
  aliases: [BOUNCE_PROCESSOR_ALIAS],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.emailCampaigns",
  subCategory: "endpointCategories.emailCampaignsProcessing",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: BounceProcessorConfigWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Config fields
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.enabled.label",
        description: "put.enabled.description",
        schema: z.boolean().default(false),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.dryRun.label",
        description: "put.dryRun.description",
        schema: z.boolean().default(false),
      }),
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.batchSize.label",
        description: "put.batchSize.description",
        schema: z.coerce.number().int().min(1).max(500).default(100),
      }),
      schedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.schedule.label",
        description: "put.schedule.description",
        schema: z.string().min(1).default("*/15 * * * *"),
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
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
      // Response fields
      bouncesFound: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.bouncesFound",
        schema: z.number(),
      }),
      leadsUpdated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsUpdated",
        schema: z.number(),
      }),
      campaignsCancelled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.campaignsCancelled",
        schema: z.number(),
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
        enabled: true,
        dryRun: false,
        batchSize: 100,
        schedule: "*/15 * * * *",
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 30000,
      },
    },
    responses: {
      default: { bouncesFound: 0, leadsUpdated: 0, campaignsCancelled: 0 },
    },
  },
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "bounce-processor"],
  allowedRoles: [UserRole.ADMIN],
  icon: "mail",
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.emailCampaigns",
  subCategory: "endpointCategories.emailCampaignsProcessing",
  tags: ["tag"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.title",
    description: "get.description",
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      enabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.enabled",
        schema: z.boolean().default(false),
      }),
      dryRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.dryRun",
        schema: z.boolean(),
      }),
      batchSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.batchSize",
        schema: z.number().int().min(1).max(500),
      }),
      schedule: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.schedule",
        schema: z.string().min(1),
      }),
      priority: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.priority",
        schema: z.enum(CronTaskPriority).default(CronTaskPriority.MEDIUM),
      }),
      timeout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.timeout",
        schema: z.number().min(1000).max(3600000).default(300000),
      }),
      retries: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.retries",
        schema: z.number().min(0).max(10).default(3),
      }),
      retryDelay: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.retryDelay",
        schema: z.number().min(1000).max(300000).default(30000),
      }),
      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
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
    responses: {
      default: {
        enabled: false,
        dryRun: false,
        batchSize: 100,
        schedule: "*/15 * * * *",
        priority: CronTaskPriority.MEDIUM,
        timeout: 300000,
        retries: 3,
        retryDelay: 30000,
      },
    },
  },
});

export type BounceProcessorPostRequestOutput = typeof POST.types.RequestOutput;
export type BounceProcessorPostResponseOutput =
  typeof POST.types.ResponseOutput;
export type BounceProcessorConfigGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { POST, GET };
export default definitions;
