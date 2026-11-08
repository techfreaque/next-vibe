/**
 * Lifecycle Overview API Definition
 * GET: kill switch state, settings, and per-journey enrollment / send / conversion counts.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { LifecycleJourney, LifecycleJourneyDB } from "../enum";
import { lifecycleErrorTypes } from "../error-types";
import { scopedTranslation } from "../i18n";

const LifecycleOverviewWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LifecycleOverviewWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "lifecycle", "overview"],
  aliases: ["lifecycle"] as const,
  title: "overview.get.title",
  titleShort: "overview.get.titleShort",
  description: "overview.get.description",
  category: "newsletter",
  subCategory: "emailCampaignsJourneys",
  icon: "git-branch",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: LifecycleOverviewWidget,
    usage: { response: true } as const,
    children: {
      paused: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "overview.get.response.paused",
        schema: z.boolean(),
      }),
      minHoursBetweenEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "overview.get.response.minHoursBetweenEmails",
        schema: z.number(),
      }),
      maxSendsPerRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "overview.get.response.maxSendsPerRun",
        schema: z.number(),
      }),
      autoEnrollWindowDays: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "overview.get.response.autoEnrollWindowDays",
        schema: z.number(),
      }),
      requireUserMarketingConsent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "overview.get.response.requireUserMarketingConsent",
        schema: z.boolean(),
      }),
      journeys: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "overview.get.response.journeys",
        description: "overview.get.response.journeys",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            journey: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.journeys",
              schema: z.enum(LifecycleJourneyDB),
            }),
            steps: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.steps",
              schema: z.number(),
            }),
            enrolled: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.enrolled",
              schema: z.number(),
            }),
            active: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.active",
              schema: z.number(),
            }),
            completed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.completed",
              schema: z.number(),
            }),
            exited: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.exited",
              schema: z.number(),
            }),
            converted: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.converted",
              schema: z.number(),
            }),
            unsubscribed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.unsubscribed",
              schema: z.number(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.sent",
              schema: z.number(),
            }),
            sent24h: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.sent24h",
              schema: z.number(),
            }),
            attributedPaid: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "overview.get.response.attributedPaid",
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: lifecycleErrorTypes,

  successTypes: {
    title: "overview.get.success.title",
    description: "overview.get.success.description",
  },

  examples: {
    responses: {
      default: {
        paused: true,
        minHoursBetweenEmails: 48,
        maxSendsPerRun: 25,
        autoEnrollWindowDays: 14,
        requireUserMarketingConsent: true,
        journeys: [
          {
            journey: LifecycleJourney.INACTIVE_USER,
            steps: 3,
            enrolled: 0,
            active: 0,
            completed: 0,
            exited: 0,
            converted: 0,
            unsubscribed: 0,
            sent: 0,
            sent24h: 0,
            attributedPaid: 0,
          },
        ],
      },
    },
  },
});

export type LifecycleOverviewGetResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
