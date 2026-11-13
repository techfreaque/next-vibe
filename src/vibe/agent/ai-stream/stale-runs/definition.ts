/**
 * Stale Run Reaper Endpoint Definition
 * Frees chat threads stuck in 'streaming' after the process that owned the run
 * died (deploy recreate, OOM, crash). Run every 5 minutes by cron.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  STALE_RUN_BATCH_SIZE,
  STALE_RUN_LOCAL_THRESHOLD_MINUTES,
  STALE_RUN_REMOTE_THRESHOLD_MINUTES,
} from "./constants";
import { scopedTranslation } from "./i18n";

const serverError = {
  title: "errors.server.title",
  description: "errors.server.description",
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "ai-stream", "stale-runs"],
  aliases: ["stale-run-reaper"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "tasksCron",
  icon: "refresh-cw",
  tags: ["tags.maintenance"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      localThresholdMinutes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.localThresholdMinutes.label",
        description: "post.fields.localThresholdMinutes.description",
        columns: 3,
        // Floor at 5 min: five missed heartbeats - never reap a live owner.
        schema: z.coerce
          .number()
          .int()
          .min(5)
          .max(1440)
          .default(STALE_RUN_LOCAL_THRESHOLD_MINUTES),
      }),
      remoteThresholdMinutes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.remoteThresholdMinutes.label",
        description: "post.fields.remoteThresholdMinutes.description",
        columns: 3,
        schema: z.coerce
          .number()
          .int()
          .min(20)
          .max(10080)
          .default(STALE_RUN_REMOTE_THRESHOLD_MINUTES),
      }),
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.batchSize.label",
        description: "post.fields.batchSize.description",
        columns: 3,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(1000)
          .default(STALE_RUN_BATCH_SIZE),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      candidates: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.candidates",
        columns: 3,
        schema: z.number(),
      }),
      reaped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.reaped",
        columns: 3,
        schema: z.number(),
      }),
      lost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.lost",
        columns: 3,
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.failed",
        columns: 3,
        schema: z.number(),
      }),
      queuedStarted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.queuedStarted",
        columns: 3,
        schema: z.number(),
      }),
      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.executionTimeMs",
        columns: 3,
        schema: z.number(),
      }),
      threadIds: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.threadIds",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: serverError,
    [EndpointErrorTypes.FORBIDDEN]: serverError,
    [EndpointErrorTypes.SERVER_ERROR]: serverError,
    [EndpointErrorTypes.UNKNOWN_ERROR]: serverError,
    [EndpointErrorTypes.VALIDATION_FAILED]: serverError,
    [EndpointErrorTypes.NOT_FOUND]: serverError,
    [EndpointErrorTypes.CONFLICT]: serverError,
    [EndpointErrorTypes.NETWORK_ERROR]: serverError,
    [EndpointErrorTypes.UNSAVED_CHANGES]: serverError,
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        localThresholdMinutes: STALE_RUN_LOCAL_THRESHOLD_MINUTES,
        remoteThresholdMinutes: STALE_RUN_REMOTE_THRESHOLD_MINUTES,
        batchSize: STALE_RUN_BATCH_SIZE,
        dryRun: true,
      },
    },
    responses: {
      default: {
        candidates: 2,
        reaped: 2,
        lost: 0,
        failed: 0,
        queuedStarted: 1,
        executionTimeMs: 85,
        threadIds:
          "04f27bf2-fb3d-4061-9fce-d8904f9b8466, d0424db7-dc3d-4b46-8356-1a8ac3daa542",
      },
    },
  },
});

export type StaleRunReaperPostRequestOutput = typeof POST.types.RequestOutput;
export type StaleRunReaperPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
