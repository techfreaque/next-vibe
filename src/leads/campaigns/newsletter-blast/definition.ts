/**
 * Newsletter Blast API Definition
 * POST: enqueue a one-off, consent-filtered newsletter to confirmed opt-ins.
 * Runs as a one-shot cron task (see task.ts); the email-campaigns dispatcher
 * then sends the enqueued rows on its normal schedule.
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

import { newsletterBlastErrorTypes } from "./error-types";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "newsletter-blast"],
  aliases: ["newsletter-blast"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "newsletter",
  subCategory: "emailCampaignsProcessing",
  icon: "send",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 12,
        schema: z.boolean().default(false),
      }),

      scheduled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.scheduled",
        schema: z.number(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.skipped",
        schema: z.number(),
      }),
      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.errors",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: newsletterBlastErrorTypes,

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: { default: { dryRun: false } },
    responses: {
      default: { scheduled: 0, skipped: 0, errors: 0 },
    },
  },
});

export type NewsletterBlastPostRequestOutput = typeof POST.types.RequestOutput;
export type NewsletterBlastPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
