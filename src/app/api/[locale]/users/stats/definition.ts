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
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedObjectOptionalField,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
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
import { USERS_STATS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { UsersStatsContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "stats"],
  aliases: [USERS_STATS_ALIAS],
  title: "title" as const,
  description: "description" as const,
  icon: "bar-chart-3",
  category: "app.endpointCategories.userManagement",
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UsersStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: scopedWidgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 3.5,
        usage: { request: "data" },
      }),

      // === BASIC FILTERS ===
      basicFilters: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "basicFilters.title" as const,
        description: "basicFilters.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        order: 1,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { request: "data" },
        children: {
          search: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "fields.search.label" as const,
            description: "fields.search.description" as const,
            placeholder: "fields.search.placeholder" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
          status: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.status.label" as const,
            description: "fields.status.description" as const,
            options: UserStatusFilterOptions,
            columns: 6,
            schema: z.enum(UserStatusFilter).default(UserStatusFilter.ALL),
          }),
          role: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.role.label" as const,
            description: "fields.role.description" as const,
            options: UserRoleFilterOptions,
            columns: 6,
            schema: z.enum(UserRoleFilter).default(UserRoleFilter.ALL),
          }),
        },
      }),

      // === SUBSCRIPTION FILTERS ===
      subscriptionFilters: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "subscriptionFilters.title" as const,
        description: "subscriptionFilters.description" as const,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 1.5,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { request: "data" },
        children: {
          subscriptionStatus: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.subscriptionStatus.label" as const,
            description: "fields.subscriptionStatus.description" as const,
            options: SubscriptionStatusFilterOptions,
            columns: 6,
            schema: z
              .enum(SubscriptionStatusFilter)
              .default(SubscriptionStatusFilter.ALL),
          }),
          paymentMethod: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.paymentMethod.label" as const,
            description: "fields.paymentMethod.description" as const,
            options: PaymentMethodFilterOptions,
            columns: 6,
            schema: z
              .enum(PaymentMethodFilter)
              .default(PaymentMethodFilter.ALL),
          }),
        },
      }),

      // === LOCATION FILTERS ===
      locationFilters: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "locationFilters.title" as const,
        description: "locationFilters.description" as const,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 2,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { request: "data" },
        children: {
          country: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.country.label" as const,
            description: "fields.country.description" as const,
            placeholder: "fields.country.placeholder" as const,
            options: CountriesOptions,
            columns: 6,
            schema: z.enum(Countries).optional(),
          }),
          language: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.language.label" as const,
            description: "fields.language.description" as const,
            placeholder: "fields.language.placeholder" as const,
            options: LanguagesOptions,
            columns: 6,
            schema: z.enum(Languages).optional(),
          }),
        },
      }),

      // === TIME PERIOD OPTIONS ===
      timePeriodOptions: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "timePeriodOptions.title" as const,
        description: "timePeriodOptions.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 3,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { request: "data" },
        children: {
          timePeriod: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.timePeriod.label" as const,
            description: "fields.timePeriod.description" as const,
            options: TimePeriodOptions,
            columns: 3,
            schema: z.enum(TimePeriod).default(TimePeriod.DAY),
          }),
          dateRangePreset: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.dateRangePreset.label" as const,
            description: "fields.dateRangePreset.description" as const,
            options: DateRangePresetOptions,
            columns: 3,
            schema: z
              .enum(DateRangePreset)
              .default(DateRangePreset.LAST_30_DAYS),
          }),
          chartType: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.chartType.label" as const,
            description: "fields.chartType.description" as const,
            options: ChartTypeOptions,
            columns: 3,
            schema: z.enum(ChartType).default(ChartType.LINE),
          }),
          includeComparison: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.includeComparison.label" as const,
            description: "fields.includeComparison.description" as const,
            columns: 3,
            schema: z.coerce.boolean().default(false),
          }),
        },
      }),

      // === OVERVIEW STATISTICS ===
      overviewStats: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.overviewStats.title" as const,
        description: "response.overviewStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 4,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          totalUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.overviewStats.totalUsers.label" as const,
            icon: "users",
            variant: "default",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Total number of users in system"),
          }),
          activeUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.overviewStats.activeUsers.label" as const,
            icon: "check",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Number of active users"),
          }),
          inactiveUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.overviewStats.inactiveUsers.label" as const,
            icon: "alert-circle",
            variant: "muted",
            format: "compact",
            schema: z.coerce.number().describe("Number of inactive users"),
          }),
          newUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.overviewStats.newUsers.label" as const,
            icon: "trending-up",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("New users this period"),
          }),
        },
      }),

      // === EMAIL VERIFICATION STATISTICS ===
      emailStats: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.emailStats.title" as const,
        description: "response.emailStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        order: 5,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          emailVerifiedUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.emailStats.emailVerifiedUsers.label" as const,
            icon: "check-circle",
            variant: "success",
            format: "compact",
            schema: z.coerce.number().describe("Users with verified emails"),
          }),
          emailUnverifiedUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.emailStats.emailUnverifiedUsers.label" as const,
            icon: "x-circle",
            variant: "warning",
            format: "compact",
            schema: z.coerce.number().describe("Users with unverified emails"),
          }),
          verificationRate: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.emailStats.verificationRate.label" as const,
            icon: "activity",
            variant: "info",
            format: "percentage",
            schema: z.coerce
              .number()
              .describe("Email verification percentage (0-1)"),
          }),
        },
      }),

      // === SUBSCRIPTION STATISTICS ===
      subscriptionStats: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.subscriptionStats.title" as const,
        description: "response.subscriptionStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 6,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          activeSubscriptions: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label:
              "response.subscriptionStats.activeSubscriptions.label" as const,
            icon: "check",
            variant: "success",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with active subscriptions"),
          }),
          canceledSubscriptions: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label:
              "response.subscriptionStats.canceledSubscriptions.label" as const,
            icon: "x",
            variant: "warning",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with canceled subscriptions"),
          }),
          expiredSubscriptions: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label:
              "response.subscriptionStats.expiredSubscriptions.label" as const,
            icon: "clock",
            variant: "muted",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users with expired subscriptions"),
          }),
          noSubscription: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.subscriptionStats.noSubscription.label" as const,
            icon: "users",
            variant: "muted",
            format: "compact",
            schema: z.coerce
              .number()
              .describe("Users without any subscription"),
          }),
          subscriptionChart: scopedResponseField(scopedTranslation, {
            type: WidgetType.CHART,
            chartType: "pie",
            label:
              "response.subscriptionStats.subscriptionChart.label" as const,
            description:
              "response.subscriptionStats.subscriptionChart.description" as const,
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
      }),

      // === PAYMENT STATISTICS ===
      paymentStats: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.paymentStats.title" as const,
        description: "response.paymentStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 4,
        order: 6.5,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          totalRevenue: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.paymentStats.totalRevenue.label" as const,
            icon: "dollar-sign",
            variant: "success",
            format: "currency",
            schema: z.coerce.number().describe("Total revenue in cents"),
          }),
          transactionCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.paymentStats.transactionCount.label" as const,
            icon: "receipt",
            variant: "info",
            format: "compact",
            schema: z.coerce.number().describe("Total number of transactions"),
          }),
          averageOrderValue: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.paymentStats.averageOrderValue.label" as const,
            icon: "trending-up",
            variant: "info",
            format: "currency",
            schema: z.coerce.number().describe("Average order value in cents"),
          }),
          refundRate: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.paymentStats.refundRate.label" as const,
            icon: "refresh-cw",
            variant: "warning",
            format: "percentage",
            schema: z.coerce.number().describe("Refund rate (0-1)"),
          }),
        },
      }),

      // === ROLE DISTRIBUTION ===
      roleDistribution: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.roleStats.title" as const,
        description: "response.roleStats.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        order: 7,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          publicUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.roleStats.publicUsers.label" as const,
            icon: "users",
            variant: "muted",
            size: "sm",
            schema: z.coerce.number().describe("Users with public role"),
          }),
          customerUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.roleStats.customerUsers.label" as const,
            icon: "users",
            variant: "success",
            size: "sm",
            schema: z.coerce.number().describe("Users with customer role"),
          }),
          partnerAdminUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.roleStats.partnerAdminUsers.label" as const,
            icon: "users",
            variant: "info",
            size: "sm",
            schema: z.coerce.number().describe("Users with partner admin role"),
          }),
          partnerEmployeeUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.roleStats.partnerEmployeeUsers.label" as const,
            icon: "users",
            variant: "info",
            size: "sm",
            schema: z.coerce
              .number()
              .describe("Users with partner employee role"),
          }),
          adminUsers: scopedResponseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "response.roleStats.adminUsers.label" as const,
            icon: "star",
            variant: "warning",
            size: "sm",
            schema: z.coerce.number().describe("Users with admin role"),
          }),
          roleChart: scopedResponseField(scopedTranslation, {
            type: WidgetType.CHART,
            chartType: "pie",
            label: "response.roleStats.roleChart.label" as const,
            description: "response.roleStats.roleChart.description" as const,
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
      }),

      // === GROWTH METRICS ===
      growthMetrics: scopedObjectFieldNew(scopedTranslation, {
        title: "response.growthMetrics.title" as const,
        description: "response.growthMetrics.description" as const,
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        order: 8,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          timeSeriesData: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.timeStats.title" as const,
            description: "response.timeStats.description" as const,
            layoutType: LayoutType.GRID,
            columns: 4,
            showFormAlert: false,
            showSubmitButton: false,
            usage: { response: true },
            children: {
              usersCreatedToday: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "response.timeStats.usersCreatedToday.label" as const,
                icon: "clock",
                variant: "info",
                size: "sm",
                schema: z.coerce.number().describe("Users created today"),
              }),
              usersCreatedThisWeek: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "response.timeStats.usersCreatedThisWeek.label" as const,
                icon: "clock",
                variant: "info",
                size: "sm",
                schema: z.coerce.number().describe("Users created this week"),
              }),
              usersCreatedThisMonth: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label:
                  "response.timeStats.usersCreatedThisMonth.label" as const,
                icon: "clock",
                variant: "success",
                size: "sm",
                schema: z.coerce.number().describe("Users created this month"),
              }),
              usersCreatedLastMonth: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label:
                  "response.timeStats.usersCreatedLastMonth.label" as const,
                icon: "clock",
                variant: "muted",
                size: "sm",
                schema: z.coerce.number().describe("Users created last month"),
              }),
            },
          }),
          performanceRates: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.performanceRates.title" as const,
            description: "response.performanceRates.description" as const,
            layoutType: LayoutType.GRID,
            columns: 3,
            showFormAlert: false,
            showSubmitButton: false,
            usage: { response: true },
            children: {
              growthRate: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "response.performanceRates.growthRate.label" as const,
                icon: "trending-up",
                variant: "success",
                format: "percentage",
                schema: z.coerce
                  .number()
                  .describe("User growth rate percentage (0-1)"),
              }),
              leadToUserConversionRate: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label:
                  "response.performanceRates.leadToUserConversionRate.label" as const,
                icon: "target",
                variant: "info",
                format: "percentage",
                schema: z.coerce
                  .number()
                  .describe("Lead to user conversion rate (0-1)"),
              }),
              retentionRate: scopedResponseField(scopedTranslation, {
                type: WidgetType.STAT,
                label: "response.performanceRates.retentionRate.label" as const,
                icon: "users",
                variant: "success",
                format: "percentage",
                schema: z.coerce.number().describe("User retention rate (0-1)"),
              }),
            },
          }),
          growthChart: scopedResponseField(scopedTranslation, {
            type: WidgetType.CHART,
            chartType: "bar",
            label: "response.growthMetrics.growthChart.label" as const,
            description:
              "response.growthMetrics.growthChart.description" as const,
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
      }),

      // === BUSINESS INSIGHTS ===
      businessInsights: scopedObjectFieldNew(scopedTranslation, {
        title: "response.businessInsights.title" as const,
        description: "response.businessInsights.description" as const,
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        order: 9,
        showFormAlert: false,
        showSubmitButton: false,
        usage: { response: true },
        children: {
          generatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            fieldType: FieldDataType.DATETIME,
            label: "response.businessInsights.generatedAt.label" as const,
            content: "response.businessInsights.generatedAt.label" as const,
            schema: dateSchema.describe("When these statistics were generated"),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
  },
  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
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
              label: "response.subscriptionStats.activeSubscriptions.label",
            },
            {
              x: "Canceled",
              y: 120,
              label: "response.subscriptionStats.canceledSubscriptions.label",
            },
            {
              x: "Expired",
              y: 230,
              label: "response.subscriptionStats.expiredSubscriptions.label",
            },
            {
              x: "None",
              y: 1250,
              label: "response.subscriptionStats.noSubscription.label",
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
