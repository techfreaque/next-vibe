/**
 * Lifecycle Backfill API Definition
 * POST: preview (dry run, default) then enroll existing eligible contacts into the
 * right journey by current state. Enrolled contacts start at step 0 spread evenly
 * over a send window, so the existing base is never emailed in one burst.
 * Sending still requires the kill switch to be OFF.
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { LifecycleJourney, LifecycleJourneyDB } from "../enum";
import { lifecycleErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "lifecycle", "backfill"],
  aliases: ["lifecycle-backfill"] as const,
  title: "backfill.post.title",
  titleShort: "backfill.post.titleShort",
  description: "backfill.post.description",
  category: "newsletter",
  subCategory: "emailCampaignsJourneys",
  icon: "users",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "backfill.post.container.title",
    description: "backfill.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "backfill.post.fields.dryRun.label",
        description: "backfill.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      spreadHours: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "backfill.post.fields.spreadHours.label",
        description: "backfill.post.fields.spreadHours.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(720).default(72),
      }),

      dryRunResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.dryRunResult",
        schema: z.boolean(),
      }),
      segments: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "backfill.post.response.segments",
        description: "backfill.post.response.segments",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            journey: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.post.response.journey",
              schema: z.enum(LifecycleJourneyDB),
            }),
            eligible: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.post.response.eligible",
              schema: z.number(),
            }),
            alreadyEnrolled: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.post.response.alreadyEnrolled",
              schema: z.number(),
            }),
            enrolled: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "backfill.post.response.enrolled",
              schema: z.number(),
            }),
          },
        }),
      }),
      heldSuppressed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldSuppressed",
        schema: z.number(),
      }),
      heldPaid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldPaid",
        schema: z.number(),
      }),
      heldNoConsent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldNoConsent",
        schema: z.number(),
      }),
      heldUnverified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldUnverified",
        schema: z.number(),
      }),
      heldPendingNewsletter: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldPendingNewsletter",
        schema: z.number(),
      }),
      heldInactiveAccount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "backfill.post.response.heldInactiveAccount",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: lifecycleErrorTypes,

  successTypes: {
    title: "backfill.post.success.title",
    description: "backfill.post.success.description",
  },

  examples: {
    requests: { default: { dryRun: true, spreadHours: 72 } },
    responses: {
      default: {
        dryRunResult: true,
        segments: [
          {
            journey: LifecycleJourney.INACTIVE_USER,
            eligible: 0,
            alreadyEnrolled: 0,
            enrolled: 0,
          },
        ],
        heldSuppressed: 0,
        heldPaid: 0,
        heldNoConsent: 0,
        heldUnverified: 0,
        heldPendingNewsletter: 0,
        heldInactiveAccount: 0,
      },
    },
  },
});

export type LifecycleBackfillPostRequestOutput =
  typeof POST.types.RequestOutput;
export type LifecycleBackfillPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
