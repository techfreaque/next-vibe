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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "import", "process"],
  title: "import.process.post.title",
  description: "import.process.post.description",
  category: "endpointCategories.leadsImport",
  icon: "upload",
  tags: ["import.process.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "import.process.post.container.title",
    description: "import.process.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      maxJobsPerRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "import.process.post.fields.maxJobsPerRun.label",
        description: "import.process.post.fields.maxJobsPerRun.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(10).default(5),
      }),

      maxRetriesPerJob: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "import.process.post.fields.maxRetriesPerJob.label",
        description: "import.process.post.fields.maxRetriesPerJob.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(5).default(3),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "import.process.post.fields.dryRun.label",
        description: "import.process.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      selfTaskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "import.process.post.fields.selfTaskId.label",
        description: "import.process.post.fields.selfTaskId.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      jobsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "import.process.post.response.jobsProcessed",
        schema: z.number(),
      }),

      totalRowsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "import.process.post.response.totalRowsProcessed",
        schema: z.number(),
      }),

      successfulImports: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "import.process.post.response.successfulImports",
        schema: z.number(),
      }),

      failedImports: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "import.process.post.response.failedImports",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "import.process.post.errors.unauthorized.title",
      description: "import.process.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "import.process.post.errors.forbidden.title",
      description: "import.process.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "import.process.post.errors.server.title",
      description: "import.process.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "import.process.post.errors.unknown.title",
      description: "import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "import.process.post.errors.validation.title",
      description: "import.process.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "import.process.post.errors.unknown.title",
      description: "import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "import.process.post.errors.unknown.title",
      description: "import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "import.process.post.errors.unknown.title",
      description: "import.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "import.process.post.errors.unknown.title",
      description: "import.process.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "import.process.post.success.title",
    description: "import.process.post.success.description",
  },

  examples: {
    requests: {
      default: {
        maxJobsPerRun: 5,
        maxRetriesPerJob: 3,
        dryRun: false,
        selfTaskId: undefined,
      },
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
