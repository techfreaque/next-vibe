/**
 * Goals Enums with Translation Options
 * Enum definitions for business goals data with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Business Goal
 */
export const {
  enum: BusinessGoal,
  options: BusinessGoalOptions,
  Value: BusinessGoalValue,
} = createEnumOptions({
  INCREASE_REVENUE:
    "app.api.v1.core.businessData.goals.enums.businessGoal.increaseRevenue",
  GROW_CUSTOMER_BASE:
    "app.api.v1.core.businessData.goals.enums.businessGoal.growCustomerBase",
  IMPROVE_BRAND_AWARENESS:
    "app.api.v1.core.businessData.goals.enums.businessGoal.improveBrandAwareness",
  ENHANCE_CUSTOMER_ENGAGEMENT:
    "app.api.v1.core.businessData.goals.enums.businessGoal.enhanceCustomerEngagement",
  EXPAND_MARKET_REACH:
    "app.api.v1.core.businessData.goals.enums.businessGoal.expandMarketReach",
  OPTIMIZE_OPERATIONS:
    "app.api.v1.core.businessData.goals.enums.businessGoal.optimizeOperations",
  LAUNCH_NEW_PRODUCTS:
    "app.api.v1.core.businessData.goals.enums.businessGoal.launchNewProducts",
  IMPROVE_CUSTOMER_RETENTION:
    "app.api.v1.core.businessData.goals.enums.businessGoal.improveCustomerRetention",
  REDUCE_COSTS:
    "app.api.v1.core.businessData.goals.enums.businessGoal.reduceCosts",
  DIGITAL_TRANSFORMATION:
    "app.api.v1.core.businessData.goals.enums.businessGoal.digitalTransformation",
  IMPROVE_ONLINE_PRESENCE:
    "app.api.v1.core.businessData.goals.enums.businessGoal.improveOnlinePresence",
  GENERATE_LEADS:
    "app.api.v1.core.businessData.goals.enums.businessGoal.generateLeads",
});

/**
 * Goal Category
 */
export const {
  enum: GoalCategory,
  options: GoalCategoryOptions,
  Value: GoalCategoryValue,
} = createEnumOptions({
  REVENUE: "app.api.v1.core.businessData.goals.enums.goalCategory.revenue",
  GROWTH: "app.api.v1.core.businessData.goals.enums.goalCategory.growth",
  MARKETING: "app.api.v1.core.businessData.goals.enums.goalCategory.marketing",
  OPERATIONS:
    "app.api.v1.core.businessData.goals.enums.goalCategory.operations",
  CUSTOMER: "app.api.v1.core.businessData.goals.enums.goalCategory.customer",
  PRODUCT: "app.api.v1.core.businessData.goals.enums.goalCategory.product",
  TEAM: "app.api.v1.core.businessData.goals.enums.goalCategory.team",
  BRAND: "app.api.v1.core.businessData.goals.enums.goalCategory.brand",
  EFFICIENCY:
    "app.api.v1.core.businessData.goals.enums.goalCategory.efficiency",
  EXPANSION: "app.api.v1.core.businessData.goals.enums.goalCategory.expansion",
});

/**
 * Goal Timeframe
 */
export const {
  enum: GoalTimeframe,
  options: GoalTimeframeOptions,
  Value: GoalTimeframeValue,
} = createEnumOptions({
  SHORT_TERM:
    "app.api.v1.core.businessData.goals.enums.goalTimeframe.shortTerm",
  MEDIUM_TERM:
    "app.api.v1.core.businessData.goals.enums.goalTimeframe.mediumTerm",
  LONG_TERM: "app.api.v1.core.businessData.goals.enums.goalTimeframe.longTerm",
  ONGOING: "app.api.v1.core.businessData.goals.enums.goalTimeframe.ongoing",
});

/**
 * Goal Priority
 */
export const {
  enum: GoalPriority,
  options: GoalPriorityOptions,
  Value: GoalPriorityValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.businessData.goals.enums.goalPriority.low",
  MEDIUM: "app.api.v1.core.businessData.goals.enums.goalPriority.medium",
  HIGH: "app.api.v1.core.businessData.goals.enums.goalPriority.high",
  CRITICAL: "app.api.v1.core.businessData.goals.enums.goalPriority.critical",
});

/**
 * Metric Type
 */
export const {
  enum: MetricType,
  options: MetricTypeOptions,
  Value: MetricTypeValue,
} = createEnumOptions({
  REVENUE: "app.api.v1.core.businessData.goals.enums.metricType.revenue",
  CUSTOMERS: "app.api.v1.core.businessData.goals.enums.metricType.customers",
  TRAFFIC: "app.api.v1.core.businessData.goals.enums.metricType.traffic",
  CONVERSIONS:
    "app.api.v1.core.businessData.goals.enums.metricType.conversions",
  ENGAGEMENT: "app.api.v1.core.businessData.goals.enums.metricType.engagement",
  RETENTION: "app.api.v1.core.businessData.goals.enums.metricType.retention",
  SATISFACTION:
    "app.api.v1.core.businessData.goals.enums.metricType.satisfaction",
  EFFICIENCY: "app.api.v1.core.businessData.goals.enums.metricType.efficiency",
  REACH: "app.api.v1.core.businessData.goals.enums.metricType.reach",
  BRAND_AWARENESS:
    "app.api.v1.core.businessData.goals.enums.metricType.brandAwareness",
});

// Create DB arrays for database schema
export const BusinessGoalDB = [
  BusinessGoal.INCREASE_REVENUE,
  BusinessGoal.GROW_CUSTOMER_BASE,
  BusinessGoal.IMPROVE_BRAND_AWARENESS,
  BusinessGoal.ENHANCE_CUSTOMER_ENGAGEMENT,
  BusinessGoal.EXPAND_MARKET_REACH,
  BusinessGoal.OPTIMIZE_OPERATIONS,
  BusinessGoal.LAUNCH_NEW_PRODUCTS,
  BusinessGoal.IMPROVE_CUSTOMER_RETENTION,
  BusinessGoal.REDUCE_COSTS,
  BusinessGoal.DIGITAL_TRANSFORMATION,
  BusinessGoal.IMPROVE_ONLINE_PRESENCE,
  BusinessGoal.GENERATE_LEADS,
] as const;

export const GoalCategoryDB = [
  GoalCategory.REVENUE,
  GoalCategory.GROWTH,
  GoalCategory.MARKETING,
  GoalCategory.OPERATIONS,
  GoalCategory.CUSTOMER,
  GoalCategory.PRODUCT,
  GoalCategory.TEAM,
  GoalCategory.BRAND,
  GoalCategory.EFFICIENCY,
  GoalCategory.EXPANSION,
] as const;

export const GoalTimeframeDB = [
  GoalTimeframe.SHORT_TERM,
  GoalTimeframe.MEDIUM_TERM,
  GoalTimeframe.LONG_TERM,
  GoalTimeframe.ONGOING,
] as const;

export const GoalPriorityDB = [
  GoalPriority.LOW,
  GoalPriority.MEDIUM,
  GoalPriority.HIGH,
  GoalPriority.CRITICAL,
] as const;

export const MetricTypeDB = [
  MetricType.REVENUE,
  MetricType.CUSTOMERS,
  MetricType.TRAFFIC,
  MetricType.CONVERSIONS,
  MetricType.ENGAGEMENT,
  MetricType.RETENTION,
  MetricType.SATISFACTION,
  MetricType.EFFICIENCY,
  MetricType.REACH,
  MetricType.BRAND_AWARENESS,
] as const;
