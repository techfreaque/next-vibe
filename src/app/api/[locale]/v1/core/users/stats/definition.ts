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
} from "@/app/api/[locale]/v1/core/shared/stats-filtering";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

import {
  UserRoleFilter,
  UserRoleFilterOptions,
  UserStatusFilter,
  UserStatusFilterOptions,
} from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "users", "stats"],
  title: "app.api.v1.core.users.stats.title" as const,
  description: "app.api.v1.core.users.stats.description" as const,
  category: "app.api.v1.core.users.stats.category" as const,
  tags: ["app.api.v1.core.users.stats.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.users.stats.container.title" as const,
      description: "app.api.v1.core.users.stats.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.users.stats.fields.status.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.status.description" as const,
          options: UserStatusFilterOptions,
          layout: { columns: 3 },
        },
        z.enum(UserStatusFilter).default(UserStatusFilter.ALL),
      ),
      role: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.users.stats.fields.role.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.role.description" as const,
          options: UserRoleFilterOptions,
          layout: { columns: 3 },
        },
        z.enum(UserRoleFilter).default(UserRoleFilter.ALL),
      ),
      country: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.users.stats.fields.country.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.country.description" as const,
          placeholder:
            "app.api.v1.core.users.stats.fields.country.placeholder" as const,
          layout: { columns: 3 },
        },
        z.enum(Countries).optional(),
      ),
      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.users.stats.fields.language.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.language.description" as const,
          placeholder:
            "app.api.v1.core.users.stats.fields.language.placeholder" as const,
          layout: { columns: 3 },
        },
        z.enum(Languages).optional(),
      ),
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.users.stats.fields.search.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.search.description" as const,
          placeholder:
            "app.api.v1.core.users.stats.fields.search.placeholder" as const,
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // === STATS FILTERING OPTIONS ===
      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.users.stats.fields.timePeriod.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.timePeriod.description" as const,
          options: TimePeriodOptions,
          layout: { columns: 3 },
        },
        z.nativeEnum(TimePeriod).default(TimePeriod.DAY),
      ),
      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.users.stats.fields.dateRangePreset.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.dateRangePreset.description" as const,
          options: DateRangePresetOptions,
          layout: { columns: 3 },
        },
        z.nativeEnum(DateRangePreset).default(DateRangePreset.LAST_30_DAYS),
      ),
      chartType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.users.stats.fields.chartType.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.chartType.description" as const,
          options: ChartTypeOptions,
          layout: { columns: 3 },
        },
        z.nativeEnum(ChartType).default(ChartType.LINE),
      ),
      includeComparison: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.users.stats.fields.includeComparison.label" as const,
          description:
            "app.api.v1.core.users.stats.fields.includeComparison.description" as const,
          layout: { columns: 3 },
        },
        z.coerce.boolean().default(false),
      ),

      // === OVERVIEW STATISTICS ===
      overviewStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.users.stats.response.overviewStats.title" as const,
          description:
            "app.api.v1.core.users.stats.response.overviewStats.description" as const,
          layout: { type: LayoutType.GRID, columns: 4 },
        },
        { response: true },
        {
          totalUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.overviewStats.totalUsers.content" as const,
            },
            z.number().describe("Total number of users in system"),
          ),
          activeUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.overviewStats.activeUsers.content" as const,
            },
            z.number().describe("Number of active users"),
          ),
          inactiveUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.overviewStats.inactiveUsers.content" as const,
            },
            z.number().describe("Number of inactive users"),
          ),
          newUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.overviewStats.newUsers.content" as const,
            },
            z.number().describe("New users this period"),
          ),
        },
      ),

      // === EMAIL VERIFICATION STATISTICS ===
      emailStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.users.stats.response.emailStats.title" as const,
          description:
            "app.api.v1.core.users.stats.response.emailStats.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { response: true },
        {
          emailVerifiedUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.emailStats.emailVerifiedUsers.content" as const,
            },
            z.number().describe("Users with verified emails"),
          ),
          emailUnverifiedUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.emailStats.emailUnverifiedUsers.content" as const,
            },
            z.number().describe("Users with unverified emails"),
          ),
          verificationRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.emailStats.verificationRate.content" as const,
            },
            z.number().describe("Email verification percentage (0-1)"),
          ),
        },
      ),

      // === INTEGRATION STATISTICS ===
      integrationStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.users.stats.response.integrationStats.title" as const,
          description:
            "app.api.v1.core.users.stats.response.integrationStats.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { response: true },
        {
          usersWithStripeId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.usersWithStripeId.content" as const,
            },
            z.number().describe("Users with Stripe integration"),
          ),
          usersWithoutStripeId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.usersWithoutStripeId.content" as const,
            },
            z.number().describe("Users without Stripe integration"),
          ),
          stripeIntegrationRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.stripeIntegrationRate.content" as const,
            },
            z.number().describe("Stripe integration percentage (0-1)"),
          ),
          usersWithLeadId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.usersWithLeadId.content" as const,
            },
            z.number().describe("Users linked to leads"),
          ),
          usersWithoutLeadId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.usersWithoutLeadId.content" as const,
            },
            z.number().describe("Users not linked to leads"),
          ),
          leadAssociationRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.integrationStats.leadAssociationRate.content" as const,
            },
            z.number().describe("Lead association percentage (0-1)"),
          ),
        },
      ),

      // === ROLE DISTRIBUTION ===
      roleDistribution: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.users.stats.response.roleStats.title" as const,
          description:
            "app.api.v1.core.users.stats.response.roleStats.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { response: true },
        {
          publicUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.roleStats.publicUsers.content" as const,
            },
            z.number().describe("Users with public role"),
          ),
          customerUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.roleStats.customerUsers.content" as const,
            },
            z.number().describe("Users with customer role"),
          ),
          partnerAdminUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.roleStats.partnerAdminUsers.content" as const,
            },
            z.number().describe("Users with partner admin role"),
          ),
          partnerEmployeeUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.roleStats.partnerEmployeeUsers.content" as const,
            },
            z.number().describe("Users with partner employee role"),
          ),
          adminUsers: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.roleStats.adminUsers.content" as const,
            },
            z.number().describe("Users with admin role"),
          ),
        },
      ),

      // === GROWTH METRICS ===
      growthMetrics: objectField(
        {
          title:
            "app.api.v1.core.users.stats.response.growthMetrics.title" as const,
          description:
            "app.api.v1.core.users.stats.response.growthMetrics.description" as const,
          type: WidgetType.CONTAINER,
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { response: true },
        {
          timeSeriesData: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.users.stats.response.timeStats.title" as const,
              description:
                "app.api.v1.core.users.stats.response.timeStats.description" as const,
              layout: { type: LayoutType.VERTICAL },
            },
            { response: true },
            {
              usersCreatedToday: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.timeStats.usersCreatedToday.content" as const,
                },
                z.number().describe("Users created today"),
              ),
              usersCreatedThisWeek: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.timeStats.usersCreatedThisWeek.content" as const,
                },
                z.number().describe("Users created this week"),
              ),
              usersCreatedThisMonth: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.timeStats.usersCreatedThisMonth.content" as const,
                },
                z.number().describe("Users created this month"),
              ),
              usersCreatedLastMonth: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.timeStats.usersCreatedLastMonth.content" as const,
                },
                z.number().describe("Users created last month"),
              ),
            },
          ),
          performanceRates: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.users.stats.response.performanceRates.title" as const,
              description:
                "app.api.v1.core.users.stats.response.performanceRates.description" as const,
              layout: { type: LayoutType.VERTICAL },
            },
            { response: true },
            {
              growthRate: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.performanceRates.growthRate.content" as const,
                },
                z.number().describe("User growth rate percentage (0-1)"),
              ),
              leadToUserConversionRate: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.performanceRates.leadToUserConversionRate.content" as const,
                },
                z.number().describe("Lead to user conversion rate (0-1)"),
              ),
              retentionRate: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.users.stats.response.performanceRates.retentionRate.content" as const,
                },
                z.number().describe("User retention rate (0-1)"),
              ),
            },
          ),
        },
      ),

      // === BUSINESS INSIGHTS ===
      businessInsights: objectField(
        {
          title:
            "app.api.v1.core.users.stats.response.businessInsights.title" as const,
          description:
            "app.api.v1.core.users.stats.response.businessInsights.description" as const,
          type: WidgetType.CONTAINER,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          generatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.stats.response.businessInsights.generatedAt.content" as const,
            },
            z
              .string()
              .datetime()
              .describe("When these statistics were generated"),
          ),
        },
      ),

      // === BACKWARD COMPATIBILITY - Keep individual fields ===
      totalUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.totalUsers.content" as const,
        },
        z.number(),
      ),
      activeUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.activeUsers.content" as const,
        },
        z.number(),
      ),
      inactiveUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.inactiveUsers.content" as const,
        },
        z.number(),
      ),
      newUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.newUsers.content" as const,
        },
        z.number(),
      ),

      emailVerifiedUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.emailVerifiedUsers.content" as const,
        },
        z.number(),
      ),
      emailUnverifiedUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.emailUnverifiedUsers.content" as const,
        },
        z.number(),
      ),
      verificationRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.verificationRate.content" as const,
        },
        z.number(),
      ),
      usersWithStripeId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersWithStripeId.content" as const,
        },
        z.number(),
      ),
      usersWithoutStripeId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersWithoutStripeId.content" as const,
        },
        z.number(),
      ),
      stripeIntegrationRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.stripeIntegrationRate.content" as const,
        },
        z.number(),
      ),
      usersWithLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersWithLeadId.content" as const,
        },
        z.number(),
      ),
      usersWithoutLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersWithoutLeadId.content" as const,
        },
        z.number(),
      ),
      leadAssociationRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.leadAssociationRate.content" as const,
        },
        z.number(),
      ),
      publicUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.publicUsers.content" as const,
        },
        z.number(),
      ),
      customerUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.customerUsers.content" as const,
        },
        z.number(),
      ),
      partnerAdminUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.partnerAdminUsers.content" as const,
        },
        z.number(),
      ),
      partnerEmployeeUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.partnerEmployeeUsers.content" as const,
        },
        z.number(),
      ),
      adminUsers: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.adminUsers.content" as const,
        },
        z.number(),
      ),
      usersCreatedToday: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersCreatedToday.content" as const,
        },
        z.number(),
      ),
      usersCreatedThisWeek: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersCreatedThisWeek.content" as const,
        },
        z.number(),
      ),
      usersCreatedThisMonth: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersCreatedThisMonth.content" as const,
        },
        z.number(),
      ),
      usersCreatedLastMonth: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.usersCreatedLastMonth.content" as const,
        },
        z.number(),
      ),
      growthRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.growthRate.content" as const,
        },
        z.number(),
      ),
      leadToUserConversionRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.leadToUserConversionRate.content" as const,
        },
        z.number(),
      ),
      retentionRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.retentionRate.content" as const,
        },
        z.number(),
      ),

      generatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.stats.response.generatedAt.content" as const,
        },
        z.string().datetime(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.users.stats.errors.validation.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.users.stats.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.users.stats.errors.server.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.users.stats.errors.unknown.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.users.stats.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.users.stats.errors.conflict.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.users.stats.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.users.stats.errors.notFound.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.users.stats.errors.network.title" as const,
      description:
        "app.api.v1.core.users.stats.errors.network.description" as const,
    },
  },
  successTypes: {
    title: "app.api.v1.core.users.stats.success.title" as const,
    description: "app.api.v1.core.users.stats.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        status: UserStatusFilter.ALL,
        role: UserRoleFilter.ALL,
        search: "john",
        country: Countries.GLOBAL,
        language: Languages.EN,
      },
    },
    responses: {
      default: {
        totalUsers: 2450,
        activeUsers: 2100,
        inactiveUsers: 350,
        newUsers: 125,
        emailVerifiedUsers: 2200,
        emailUnverifiedUsers: 250,
        verificationRate: 0.898,
        usersWithStripeId: 1800,
        usersWithoutStripeId: 650,
        stripeIntegrationRate: 0.735,
        usersWithLeadId: 1950,
        usersWithoutLeadId: 500,
        leadAssociationRate: 0.796,
        publicUsers: 1800,
        customerUsers: 500,
        partnerAdminUsers: 50,
        partnerEmployeeUsers: 80,
        adminUsers: 20,
        usersCreatedToday: 12,
        usersCreatedThisWeek: 85,
        usersCreatedThisMonth: 320,
        usersCreatedLastMonth: 280,
        growthRate: 0.143,
        leadToUserConversionRate: 0.204,
        retentionRate: 0.857,
        generatedAt: "2024-01-07T12:00:00.000Z",
        businessInsights: {
          generatedAt: "2024-01-07T12:00:00.000Z",
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
        },
        roleDistribution: {
          publicUsers: 1800,
          customerUsers: 500,
          partnerAdminUsers: 50,
          partnerEmployeeUsers: 80,
          adminUsers: 20,
        },
        emailStats: {
          emailVerifiedUsers: 2200,
          emailUnverifiedUsers: 250,
          verificationRate: 0.898,
        },
        integrationStats: {
          usersWithStripeId: 1800,
          usersWithoutStripeId: 650,
          stripeIntegrationRate: 0.735,
          usersWithLeadId: 1950,
          usersWithoutLeadId: 500,
          leadAssociationRate: 0.796,
        },
        overviewStats: {
          totalUsers: 2450,
          activeUsers: 2100,
          inactiveUsers: 350,
          newUsers: 125,
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

// Alias types for consistency with repository imports
export type UsersStatsResponseType = UserStatsResponseOutput;
export type UserStatsRequestType = UserStatsRequestOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export { GET };
export default definitions;
