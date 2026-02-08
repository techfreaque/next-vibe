/**
 * Referral Stats API Definition
 * Defines the API endpoint for referral statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";

/**
 * GET endpoint for referral stats
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "stats"],
  title: "app.api.referral.stats.get.title",
  description: "app.api.referral.stats.get.description",
  category: "app.api.referral.category",
  icon: "trending-up" as const,
  tags: ["app.api.referral.tags.referral", "app.api.referral.tags.get"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      noCard: true,
      layoutType: LayoutType.GRID,
      innerClassName: "sm:grid-cols-2 lg:grid-cols-4",
      gap: "4",
    },
    { response: true },
    {
      totalSignups: objectField(
        {
          type: WidgetType.CONTAINER,
          className:
            "rounded-lg border bg-card text-card-foreground shadow-sm border-border/60 bg-gradient-to-br from-background to-muted/20",
        },
        { response: true },
        {
          header: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.INLINE,
              className:
                "gap-1.5 p-6 pb-2 flex flex-row items-center justify-between space-y-0",
            },
            { response: true },
            {
              title: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalSignups",
                schema: z.string(),
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
              }),
              icon: responseField({
                type: WidgetType.ICON,
                icon: "users",
                schema: z.string().optional(),
                className: "h-4 w-4 text-muted-foreground",
              }),
            },
          ),
          content: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.STACKED,
              className: "p-6 pt-0",
            },
            { response: true },
            {
              value: responseField({
                type: WidgetType.TEXT,
                schema: z.coerce.number(),
                className: "font-mono text-3xl font-bold tabular-nums",
              }),
              description: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalSignupsDesc",
                schema: z.string(),
                className: "text-xs text-muted-foreground mt-1",
              }),
            },
          ),
        },
      ),
      totalRevenueCredits: objectField(
        {
          type: WidgetType.CONTAINER,
          className:
            "rounded-lg border bg-card text-card-foreground shadow-sm border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10",
        },
        { response: true },
        {
          header: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.INLINE,
              className:
                "gap-1.5 p-6 pb-2 flex flex-row items-center justify-between space-y-0",
            },
            { response: true },
            {
              title: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalRevenue",
                schema: z.string(),
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
              }),
              icon: responseField({
                type: WidgetType.ICON,
                icon: "trending-up",
                schema: z.string().optional(),
                className: "h-4 w-4 text-emerald-500",
              }),
            },
          ),
          content: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.STACKED,
              className: "p-6 pt-0",
            },
            { response: true },
            {
              value: responseField({
                type: WidgetType.TEXT,
                schema: z.coerce.number(),
                className:
                  "font-mono text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400",
              }),
              description: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalRevenueDesc",
                schema: z.string(),
                className: "text-xs text-muted-foreground mt-1",
              }),
            },
          ),
        },
      ),
      totalEarnedCredits: objectField(
        {
          type: WidgetType.CONTAINER,
          className:
            "rounded-lg border bg-card text-card-foreground shadow-sm border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10",
        },
        { response: true },
        {
          header: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.INLINE,
              className:
                "gap-1.5 p-6 pb-2 flex flex-row items-center justify-between space-y-0",
            },
            { response: true },
            {
              title: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalEarned",
                schema: z.string(),
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
              }),
              icon: responseField({
                type: WidgetType.ICON,
                icon: "dollar-sign",
                schema: z.string().optional(),
                className: "h-4 w-4 text-blue-500",
              }),
            },
          ),
          content: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.STACKED,
              className: "p-6 pt-0",
            },
            { response: true },
            {
              value: responseField({
                type: WidgetType.TEXT,
                schema: z.coerce.number(),
                className:
                  "font-mono text-3xl font-bold tabular-nums text-blue-600 dark:text-blue-400",
              }),
              description: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.totalEarnedDesc",
                schema: z.string(),
                className: "text-xs text-muted-foreground mt-1",
              }),
            },
          ),
        },
      ),
      availableCredits: objectField(
        {
          type: WidgetType.CONTAINER,
          className:
            "rounded-lg border bg-card text-card-foreground shadow-sm border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-violet-500/10",
        },
        { response: true },
        {
          header: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.INLINE,
              className:
                "gap-1.5 p-6 pb-2 flex flex-row items-center justify-between space-y-0",
            },
            { response: true },
            {
              title: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.availableBalance",
                schema: z.string(),
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
              }),
              icon: responseField({
                type: WidgetType.ICON,
                icon: "wallet",
                schema: z.string().optional(),
                className: "h-4 w-4 text-violet-500",
              }),
            },
          ),
          content: objectField(
            {
              type: WidgetType.CONTAINER,
              noCard: true,
              layoutType: LayoutType.STACKED,
              className: "p-6 pt-0",
            },
            { response: true },
            {
              value: responseField({
                type: WidgetType.TEXT,
                schema: z.coerce.number(),
                className:
                  "font-mono text-3xl font-bold tabular-nums text-violet-600 dark:text-violet-400",
              }),
              description: responseField({
                type: WidgetType.TEXT,
                content: "app.user.referral.stats.availableBalanceDesc",
                schema: z.string(),
                className: "text-xs text-muted-foreground mt-1",
              }),
            },
          ),
        },
      ),
    },
  ),

  examples: {
    responses: {
      default: {
        totalSignups: {
          header: {
            title: "app.user.referral.stats.totalSignups",
            icon: undefined,
          },
          content: {
            value: 10,
            description: "app.user.referral.stats.totalSignupsDesc",
          },
        },
        totalRevenueCredits: {
          header: {
            title: "app.user.referral.stats.totalRevenue",
            icon: undefined,
          },
          content: {
            value: 8000,
            description: "app.user.referral.stats.totalRevenueDesc",
          },
        },
        totalEarnedCredits: {
          header: {
            title: "app.user.referral.stats.totalEarned",
            icon: undefined,
          },
          content: {
            value: 1600,
            description: "app.user.referral.stats.totalEarnedDesc",
          },
        },
        availableCredits: {
          header: {
            title: "app.user.referral.stats.availableBalance",
            icon: undefined,
          },
          content: {
            value: 1600,
            description: "app.user.referral.stats.availableBalanceDesc",
          },
        },
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.referral.errors.validation.title",
      description: "app.api.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.referral.errors.network.title",
      description: "app.api.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.referral.errors.unauthorized.title",
      description: "app.api.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.referral.errors.forbidden.title",
      description: "app.api.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.referral.errors.notFound.title",
      description: "app.api.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.referral.errors.serverError.title",
      description: "app.api.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.referral.errors.unknown.title",
      description: "app.api.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.referral.errors.unsavedChanges.title",
      description: "app.api.referral.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.referral.errors.conflict.title",
      description: "app.api.referral.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.referral.stats.success.title",
    description: "app.api.referral.stats.success.description",
  },
});

export type StatsGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
