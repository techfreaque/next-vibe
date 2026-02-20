/**
 * CSV Import Process API Definition
 * POST endpoint to process pending CSV import jobs (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["leads", "import", "process"],
  title: "app.api.leads.import.process.post.title",
  description: "app.api.leads.import.process.post.description",
  category: "app.api.leads.import.category",
  icon: "upload",
  tags: ["app.api.leads.import.process.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.import.process.post.container.title",
      description: "app.api.leads.import.process.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      maxJobsPerRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.leads.import.process.post.fields.maxJobsPerRun.label",
        description:
          "app.api.leads.import.process.post.fields.maxJobsPerRun.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(10).default(5),
      }),

      maxRetriesPerJob: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.leads.import.process.post.fields.maxRetriesPerJob.label",
        description:
          "app.api.leads.import.process.post.fields.maxRetriesPerJob.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(5).default(3),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.import.process.post.fields.dryRun.label",
        description:
          "app.api.leads.import.process.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      jobsProcessed: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.process.post.response.jobsProcessed",
        schema: z.number(),
      }),

      totalRowsProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.import.process.post.response.totalRowsProcessed",
        schema: z.number(),
      }),

      successfulImports: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.process.post.response.successfulImports",
        schema: z.number(),
      }),

      failedImports: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.process.post.response.failedImports",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.import.process.post.errors.unauthorized.title",
      description:
        "app.api.leads.import.process.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.process.post.errors.forbidden.title",
      description:
        "app.api.leads.import.process.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.process.post.errors.server.title",
      description:
        "app.api.leads.import.process.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.process.post.errors.unknown.title",
      description:
        "app.api.leads.import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.import.process.post.errors.validation.title",
      description:
        "app.api.leads.import.process.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.process.post.errors.unknown.title",
      description:
        "app.api.leads.import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.process.post.errors.unknown.title",
      description:
        "app.api.leads.import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.process.post.errors.unknown.title",
      description:
        "app.api.leads.import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.import.process.post.errors.unknown.title",
      description:
        "app.api.leads.import.process.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.leads.import.process.post.success.title",
    description: "app.api.leads.import.process.post.success.description",
  },

  examples: {
    requests: {
      default: { maxJobsPerRun: 5, maxRetriesPerJob: 3, dryRun: false },
    },
    responses: {
      default: {
        jobsProcessed: 0,
        totalRowsProcessed: 0,
        successfulImports: 0,
        failedImports: 0,
      },
    },
  },
});

export type ImportProcessPostRequestOutput = typeof POST.types.RequestOutput;
export type ImportProcessPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
