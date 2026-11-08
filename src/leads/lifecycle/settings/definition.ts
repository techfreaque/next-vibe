/**
 * Lifecycle Settings API Definition
 * POST: set the global kill switch, frequency cap, throttle and consent mode.
 * Omitted fields are left unchanged. Returns the settings now in force.
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
  path: ["leads", "lifecycle", "settings"],
  aliases: ["lifecycle-settings"] as const,
  title: "settings.post.title",
  titleShort: "settings.post.titleShort",
  description: "settings.post.description",
  category: "newsletter",
  subCategory: "emailCampaignsJourneys",
  icon: "settings",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "settings.post.container.title",
    description: "settings.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      paused: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "settings.post.fields.paused.label",
        description: "settings.post.fields.paused.description",
        columns: 12,
        schema: z.boolean().optional(),
      }),
      minHoursBetweenEmails: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "settings.post.fields.minHoursBetweenEmails.label",
        description: "settings.post.fields.minHoursBetweenEmails.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(720).optional(),
      }),
      maxSendsPerRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "settings.post.fields.maxSendsPerRun.label",
        description: "settings.post.fields.maxSendsPerRun.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(500).optional(),
      }),
      autoEnrollWindowDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "settings.post.fields.autoEnrollWindowDays.label",
        description: "settings.post.fields.autoEnrollWindowDays.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(365).optional(),
      }),
      requireUserMarketingConsent: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "settings.post.fields.requireUserMarketingConsent.label",
        description:
          "settings.post.fields.requireUserMarketingConsent.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      currentPaused: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.post.response.paused",
        schema: z.boolean(),
      }),
      currentMinHoursBetweenEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.post.response.minHoursBetweenEmails",
        schema: z.number(),
      }),
      currentMaxSendsPerRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.post.response.maxSendsPerRun",
        schema: z.number(),
      }),
      currentAutoEnrollWindowDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.post.response.autoEnrollWindowDays",
        schema: z.number(),
      }),
      currentRequireUserMarketingConsent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "settings.post.response.requireUserMarketingConsent",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: lifecycleErrorTypes,

  successTypes: {
    title: "settings.post.success.title",
    description: "settings.post.success.description",
  },

  examples: {
    requests: { default: { paused: true } },
    responses: {
      default: {
        currentPaused: true,
        currentMinHoursBetweenEmails: 48,
        currentMaxSendsPerRun: 25,
        currentAutoEnrollWindowDays: 14,
        currentRequireUserMarketingConsent: true,
      },
    },
  },
});

export type LifecycleSettingsPostRequestOutput =
  typeof POST.types.RequestOutput;
export type LifecycleSettingsPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
