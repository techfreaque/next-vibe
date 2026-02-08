/**
 * Users Statistics API Definition
 * Comprehensive endpoint for user analytics with historical charts
 */

import { z } from "zod";

import {
  ChartType,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodOptions,
} from "@/app/api/[locale]/shared/stats-filtering";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectFieldNew,
  objectOptionalField,
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { dateSchema } from "../../shared/types/common.schema";
import {
  PaymentMethodFilter,
  PaymentMethodFilterOptions,
  SubscriptionStatusFilter,
  SubscriptionStatusFilterOptions,
  UserRoleFilter,
  UserRoleFilterOptions,
  UserStatusFilter,
  UserStatusFilterOptions,
} from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", "stats"],
  title: "app.api.users.stats.title" as const,
  description: "app.api.users.stats.description" as const,
  icon: "bar-chart-3",
  category: "app.api.users.stats.category" as const,
  tags: ["app.api.users.stats.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    title: "app.api.users.stats.container.title" as const,
    description: "app.api.users.stats.container.description" as const,
    layoutType: LayoutType.STACKED,
    submitButton: {
      text: "app.api.users.stats.actions.refresh" as const,
      loadingText: "app.api.users.stats.actions.refreshing" as const,
      position: "header",
      icon: "refresh-cw",
      variant: "ghost",
      size: "sm",
    } as const,
    usage: { request: "data", response: true },
    children: {
      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        order: 3.5,
        usage: { request: "data" },
      }),

      // === BASIC FILTERS ===
      basicFilters: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.basicFilters.title" as const,
          description: "app.api.users.stats.basicFilters.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
          order: 1,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { request: "data" },
        {
          search: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.users.stats.fields.search.label" as const,
            description:
              "app.api.users.stats.fields.search.description" as const,
            placeholder:
              "app.api.users.stats.fields.search.placeholder" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
          status: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.status.label" as const,
            description:
              "app.api.users.stats.fields.status.description" as const,
            options: UserStatusFilterOptions,
            columns: 6,
            schema: z.enum(UserStatusFilter).default(UserStatusFilter.ALL),
          }),
          role: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.role.label" as const,
            description: "app.api.users.stats.fields.role.description" as const,
            options: UserRoleFilterOptions,
            columns: 6,
            schema: z.enum(UserRoleFilter).default(UserRoleFilter.ALL),
          }),
        },
      ),

      // === SUBSCRIPTION FILTERS ===
      subscriptionFilters: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.subscriptionFilters.title" as const,
          description:
            "app.api.users.stats.subscriptionFilters.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 1.5,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { request: "data" },
        {
          subscriptionStatus: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label:
              "app.api.users.stats.fields.subscriptionStatus.label" as const,
            description:
              "app.api.users.stats.fields.subscriptionStatus.description" as const,
            options: SubscriptionStatusFilterOptions,
            columns: 6,
            schema: z
              .enum(SubscriptionStatusFilter)
              .default(SubscriptionStatusFilter.ALL),
          }),
          paymentMethod: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.paymentMethod.label" as const,
            description:
              "app.api.users.stats.fields.paymentMethod.description" as const,
            options: PaymentMethodFilterOptions,
            columns: 6,
            schema: z
              .enum(PaymentMethodFilter)
              .default(PaymentMethodFilter.ALL),
          }),
        },
      ),

      // === LOCATION FILTERS ===
      locationFilters: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.locationFilters.title" as const,
          description:
            "app.api.users.stats.locationFilters.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 2,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { request: "data" },
        {
          country: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.country.label" as const,
            description:
              "app.api.users.stats.fields.country.description" as const,
            placeholder:
              "app.api.users.stats.fields.country.placeholder" as const,
            options: CountriesOptions,
            columns: 6,
            schema: z.enum(Countries).optional(),
          }),
          language: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.language.label" as const,
            description:
              "app.api.users.stats.fields.language.description" as const,
            placeholder:
              "app.api.users.stats.fields.language.placeholder" as const,
            options: LanguagesOptions,
            columns: 6,
            schema: z.enum(Languages).optional(),
          }),
        },
      ),

      // === TIME PERIOD OPTIONS ===
      timePeriodOptions: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.timePeriodOptions.title" as const,
          description:
            "app.api.users.stats.timePeriodOptions.description" as const,
          layoutType: LayoutType.GRID,
          columns: 4,
          order: 3,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { request: "data" },
        {
          timePeriod: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.timePeriod.label" as const,
            description:
              "app.api.users.stats.fields.timePeriod.description" as const,
            options: TimePeriodOptions,
            columns: 3,
            schema: z.enum(TimePeriod).default(TimePeriod.DAY),
          }),
          dateRangePreset: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.dateRangePreset.label" as const,
            description:
              "app.api.users.stats.fields.dateRangePreset.description" as const,
            options: DateRangePresetOptions,
            columns: 3,
            schema: z
              .enum(DateRangePreset)
              .default(DateRangePreset.LAST_30_DAYS),
          }),
          chartType: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.users.stats.fields.chartType.label" as const,
            description:
              "app.api.users.stats.fields.chartType.description" as const,
            options: ChartTypeOptions,
            columns: 3,
            schema: z.enum(ChartType).default(ChartType.LINE),
          }),
          includeComparison: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label:
              "app.api.users.stats.fields.includeComparison.label" as const,
            description:
              "app.api.users.stats.fields.includeComparison.description" as const,
            columns: 3,
            schema: z.coerce.boolean().default(false),
          }),
        },
      ),

      // === OVERVIEW STATISTICS ===
      overviewStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.response.overviewStats.title" as const,
          description:
            "app.api.users.stats.response.overviewStats.description" as const,
          layoutType: LayoutType.GRID,
          columns: 4,
          order: 4,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          totalUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.overviewStats.totalUsers.label" as const,
            icon: "users",
            variant: "default",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Total number of users in system"),
          }),
          activeUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.overviewStats.activeUsers.label" as const,
            icon: "check",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Number of active users"),
          }),
          inactiveUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.overviewStats.inactiveUsers.label" as const,
            icon: "alert-circle",
            variant: "muted",
            format: "compact",
            schema: z.coerce.number().describe("Number of inactive users"),
          }),
          newUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.overviewStats.newUsers.label" as const,
            icon: "trending-up",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("New users this period"),
          }),
        },
      ),

      // === EMAIL VERIFICATION STATISTICS ===
      emailStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.response.emailStats.title" as const,
          description:
            "app.api.users.stats.response.emailStats.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
          order: 5,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          emailVerifiedUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.emailStats.emailVerifiedUsers.label" as const,
            icon: "check-circle",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Users with verified emails"),
          }),
          emailUnverifiedUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.emailStats.emailUnverifiedUsers.label" as const,
            icon: "x-circle",
            variant: "warning",
            format: "compact",
            schema: z.coerce.number().describe("Users with unverified emails"),
          }),
          verificationRate: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.emailStats.verificationRate.label" as const,
            icon: "activity",
            variant: "info",
            format: "percentage",
            schema: z.coerce
              .number()
              .describe("Email verification percentage (0-1)"),
          }),
        },
      ),

      // === SUBSCRIPTION STATISTICS ===
      subscriptionStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.stats.response.subscriptionStats.title" as const,
          description:
            "app.api.users.stats.response.subscriptionStats.description" as const,
          layoutType: LayoutType.GRID,
          columns: 4,
          order: 6,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          activeSubscriptions: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.subscriptionStats.activeSubscriptions.label" as const,
            icon: "check",
            variant: "success",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with active subscriptions"),
          }),
          canceledSubscriptions: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.subscriptionStats.canceledSubscriptions.label" as const,
            icon: "x",
            variant: "warning",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with canceled subscriptions"),
          }),
          expiredSubscriptions: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.subscriptionStats.expiredSubscriptions.label" as const,
            icon: "clock",
            variant: "muted",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with expired subscriptions"),
          }),
          noSubscription: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.subscriptionStats.noSubscription.label" as const,
            icon: "users",
            variant: "muted",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users without any subscription"),
          }),
          subscriptionChart: responseField({
            type: WidgetType.CHART,
            chartType: "pie",
            label:
              "app.api.users.stats.response.subscriptionStats.subscriptionChart.label" as const,
            description:
              "app.api.users.stats.response.subscriptionStats.subscriptionChart.description" as const,
            height: 280,
            showLegend: true,
            columns: 12,
            schema: z
              .array(
                z.object({
                  x: z.string(),
                  y: z.coerce.number(),
                  label: z.string().optional(),
                }),
              )
              .describe("Subscription distribution chart data"),
          }),
        },
      ),

      // === PAYMENT STATISTICS ===
      paymentStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.response.paymentStats.title" as const,
          description:
            "app.api.users.stats.response.paymentStats.description" as const,
          layoutType: LayoutType.GRID,
          columns: 4,
          order: 6.5,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          totalRevenue: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.paymentStats.totalRevenue.label" as const,
            icon: "dollar-sign",
            variant: "success",
            format: "currency",
            schema: z.coerce.number().describe("Total revenue in cents"),
          }),
          transactionCount: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.paymentStats.transactionCount.label" as const,
            icon: "receipt",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Total number of transactions"),
          }),
          averageOrderValue: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.paymentStats.averageOrderValue.label" as const,
            icon: "trending-up",
            variant: "info",
            format: "currency",
            schema: z.coerce.number().describe("Average order value in cents"),
          }),
          refundRate: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.paymentStats.refundRate.label" as const,
            icon: "refresh-cw",
            variant: "warning",
            format: "percentage",
            schema: z.coerce.number().describe("Refund rate (0-1)"),
          }),
        },
      ),

      // === ROLE DISTRIBUTION ===
      roleDistribution: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.stats.response.roleStats.title" as const,
          description:
            "app.api.users.stats.response.roleStats.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
          order: 7,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          publicUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.roleStats.publicUsers.label" as const,
            icon: "users",
            variant: "muted",
            size: "sm",
            schema: z.coerce.number().describe("Users with public role"),
          }),
          customerUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.roleStats.customerUsers.label" as const,
            icon: "users",
            variant: "success",
            size: "sm",
            schema: z.coerce.number().describe("Users with customer role"),
          }),
          partnerAdminUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.roleStats.partnerAdminUsers.label" as const,
            icon: "users",
            variant: "info",
            size: "sm",
            schema: z.coerce.number().describe("Users with partner admin role"),
          }),
          partnerEmployeeUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.roleStats.partnerEmployeeUsers.label" as const,
            icon: "users",
            variant: "info",
            size: "sm",
            schema: z.coerce
              .number()
              .describe("Users with partner employee role"),
          }),
          adminUsers: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.users.stats.response.roleStats.adminUsers.label" as const,
            icon: "star",
            variant: "warning",
            size: "sm",
            schema: z.coerce.number().describe("Users with admin role"),
          }),
          roleChart: responseField({
            type: WidgetType.CHART,
            chartType: "pie",
            label:
              "app.api.users.stats.response.roleStats.roleChart.label" as const,
            description:
              "app.api.users.stats.response.roleStats.roleChart.description" as const,
            height: 280,
            showLegend: true,
            columns: 12,
            schema: z
              .array(
                z.object({
                  x: z.string(),
                  y: z.coerce.number(),
                  label: z.string().optional(),
                }),
              )
              .describe("Role distribution chart data"),
          }),
        },
      ),

      // === GROWTH METRICS ===
      growthMetrics: objectField(
        {
          title: "app.api.users.stats.response.growthMetrics.title" as const,
          description:
            "app.api.users.stats.response.growthMetrics.description" as const,
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          order: 8,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          timeSeriesData: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.users.stats.response.timeStats.title" as const,
              description:
                "app.api.users.stats.response.timeStats.description" as const,
              layoutType: LayoutType.GRID,
              columns: 4,
              showFormAlert: false,
              showSubmitButton: false,
            },
            { response: true },
            {
              usersCreatedToday: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.timeStats.usersCreatedToday.label" as const,
                icon: "clock",
                variant: "info",
                size: "sm",
                schema: z.coerce.number().describe("Users created today"),
              }),
              usersCreatedThisWeek: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.timeStats.usersCreatedThisWeek.label" as const,
                icon: "clock",
                variant: "info",
                size: "sm",
                schema: z.coerce.number().describe("Users created this week"),
              }),
              usersCreatedThisMonth: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.timeStats.usersCreatedThisMonth.label" as const,
                icon: "clock",
                variant: "success",
                size: "sm",
                schema: z.coerce.number().describe("Users created this month"),
              }),
              usersCreatedLastMonth: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.timeStats.usersCreatedLastMonth.label" as const,
                icon: "clock",
                variant: "muted",
                size: "sm",
                schema: z.coerce.number().describe("Users created last month"),
              }),
            },
          ),
          performanceRates: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.users.stats.response.performanceRates.title" as const,
              description:
                "app.api.users.stats.response.performanceRates.description" as const,
              layoutType: LayoutType.GRID,
              columns: 3,
              showFormAlert: false,
              showSubmitButton: false,
            },
            { response: true },
            {
              growthRate: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.performanceRates.growthRate.label" as const,
                icon: "trending-up",
                variant: "success",
                format: "percentage",
                schema: z.coerce
                  .number()
                  .describe("User growth rate percentage (0-1)"),
              }),
              leadToUserConversionRate: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.performanceRates.leadToUserConversionRate.label" as const,
                icon: "target",
                variant: "info",
                format: "percentage",
                schema: z.coerce
                  .number()
                  .describe("Lead to user conversion rate (0-1)"),
              }),
              retentionRate: responseField({
                type: WidgetType.STAT,
                label:
                  "app.api.users.stats.response.performanceRates.retentionRate.label" as const,
                icon: "users",
                variant: "success",
                format: "percentage",
                schema: z.coerce.number().describe("User retention rate (0-1)"),
              }),
            },
          ),
          growthChart: responseField({
            type: WidgetType.CHART,
            chartType: "bar",
            label:
              "app.api.users.stats.response.growthMetrics.growthChart.label" as const,
            description:
              "app.api.users.stats.response.growthMetrics.growthChart.description" as const,
            height: 280,
            showLegend: false,
            xAxisLabel: "Time Period",
            yAxisLabel: "Users Created",
            columns: 12,
            schema: z
              .array(
                z.object({
                  x: z.string(),
                  y: z.coerce.number(),
                  label: z.string().optional(),
                }),
              )
              .describe("User growth over time chart data"),
          }),
        },
      ),

      // === BUSINESS INSIGHTS ===
      businessInsights: objectField(
        {
          title: "app.api.users.stats.response.businessInsights.title" as const,
          description:
            "app.api.users.stats.response.businessInsights.description" as const,
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          order: 9,
          showFormAlert: false,
          showSubmitButton: false,
        },
        { response: true },
        {
          generatedAt: responseField({
            type: WidgetType.TEXT,
            fieldType: FieldDataType.DATETIME,
            label:
              "app.api.users.stats.response.businessInsights.generatedAt.label" as const,
            content:
              "app.api.users.stats.response.businessInsights.generatedAt.label" as const,
            schema: dateSchema.describe("When these statistics were generated"),
          }),
        },
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.stats.errors.validation.title" as const,
      description: "app.api.users.stats.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.stats.errors.unauthorized.title" as const,
      description:
        "app.api.users.stats.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.stats.errors.server.title" as const,
      description: "app.api.users.stats.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.stats.errors.unknown.title" as const,
      description: "app.api.users.stats.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.users.stats.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.stats.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.stats.errors.conflict.title" as const,
      description: "app.api.users.stats.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.stats.errors.forbidden.title" as const,
      description: "app.api.users.stats.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.stats.errors.notFound.title" as const,
      description: "app.api.users.stats.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.stats.errors.network.title" as const,
      description: "app.api.users.stats.errors.network.description" as const,
    },
  },
  successTypes: {
    title: "app.api.users.stats.success.title" as const,
    description: "app.api.users.stats.success.description" as const,
  },
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        overviewStats: {
          totalUsers: 2450,
          activeUsers: 2100,
          inactiveUsers: 350,
          newUsers: 125,
        },
        emailStats: {
          emailVerifiedUsers: 2200,
          emailUnverifiedUsers: 250,
          verificationRate: 0.898,
        },
        subscriptionStats: {
          activeSubscriptions: 850,
          canceledSubscriptions: 120,
          expiredSubscriptions: 230,
          noSubscription: 1250,
          subscriptionChart: [
            {
              x: "Active",
              y: 850,
              label:
                "app.api.users.stats.response.subscriptionStats.activeSubscriptions.label",
            },
            {
              x: "Canceled",
              y: 120,
              label:
                "app.api.users.stats.response.subscriptionStats.canceledSubscriptions.label",
            },
            {
              x: "Expired",
              y: 230,
              label:
                "app.api.users.stats.response.subscriptionStats.expiredSubscriptions.label",
            },
            {
              x: "None",
              y: 1250,
              label:
                "app.api.users.stats.response.subscriptionStats.noSubscription.label",
            },
          ],
        },
        paymentStats: {
          totalRevenue: 125000000,
          transactionCount: 2450,
          averageOrderValue: 5102,
          refundRate: 0.023,
        },
        roleDistribution: {
          publicUsers: 1800,
          customerUsers: 500,
          partnerAdminUsers: 50,
          partnerEmployeeUsers: 80,
          adminUsers: 20,
          roleChart: [
            { x: "Public", y: 1800, label: "Public" },
            { x: "Customer", y: 500, label: "Customer" },
            { x: "Partner Admin", y: 50, label: "Partner Admin" },
            { x: "Partner Staff", y: 80, label: "Partner Staff" },
            { x: "Admin", y: 20, label: "Admin" },
          ],
        },
        growthMetrics: {
          timeSeriesData: {
            usersCreatedToday: 12,
            usersCreatedThisWeek: 85,
            usersCreatedThisMonth: 320,
            usersCreatedLastMonth: 280,
          },
          performanceRates: {
            growthRate: 0.143,
            leadToUserConversionRate: 0.204,
            retentionRate: 0.857,
          },
          growthChart: [
            { x: "Last Month", y: 280, label: "Last Month" },
            { x: "This Month", y: 320, label: "This Month" },
            { x: "This Week", y: 85, label: "This Week" },
            { x: "Today", y: 12, label: "Today" },
          ],
        },
        businessInsights: {
          generatedAt: "2024-01-07T12:00:00.000Z",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type UserStatsRequestInput = typeof GET.types.RequestInput;
export type UserStatsRequestOutput = typeof GET.types.RequestOutput;
export type UserStatsResponseInput = typeof GET.types.ResponseInput;
export type UserStatsResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
} as const;

export default definitions;
