/**
 * Lifecycle Run API Definition
 * POST: enroll newly eligible contacts and send due journey steps (cron).
 * Does nothing while the global kill switch is on (default).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
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

import { lifecycleErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "lifecycle", "run"],
  title: "run.post.title",
  titleShort: "run.post.titleShort",
  description: "run.post.description",
  category: "newsletter",
  subCategory: "emailCampaignsJourneys",
  icon: "send",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "run.post.container.title",
    description: "run.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "run.post.fields.dryRun.label",
        description: "run.post.fields.dryRun.description",
        columns: 12,
        schema: z.boolean().default(false),
      }),

      paused: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.paused",
        schema: z.boolean(),
      }),
      enrolled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.enrolled",
        schema: z.number(),
      }),
      sent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.sent",
        schema: z.number(),
      }),
      exited: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.exited",
        schema: z.number(),
      }),
      deferred: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.deferred",
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "run.post.response.failed",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: lifecycleErrorTypes,

  successTypes: {
    title: "run.post.success.title",
    description: "run.post.success.description",
  },

  examples: {
    requests: { default: { dryRun: false } },
    responses: {
      default: {
        paused: true,
        enrolled: 0,
        sent: 0,
        exited: 0,
        deferred: 0,
        failed: 0,
      },
    },
  },
});

export type LifecycleRunPostRequestOutput = typeof POST.types.RequestOutput;
export type LifecycleRunPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
