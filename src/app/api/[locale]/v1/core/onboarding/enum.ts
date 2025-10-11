/**
 * Onboarding API Enums
 * Defines enumeration values for the onboarding API using createEnumOptions pattern
 */

import { createEnumOptions } from "../system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Onboarding Status Enum
 * Represents the current status of a user's onboarding process
 */
export const {
  enum: OnboardingStatus,
  options: OnboardingStatusOptions,
  Value: OnboardingStatusValue,
} = createEnumOptions({
  NOT_STARTED: "app.api.v1.core.onboarding.enums.onboardingStatus.notStarted",
  IN_PROGRESS: "app.api.v1.core.onboarding.enums.onboardingStatus.inProgress",
  COMPLETED: "app.api.v1.core.onboarding.enums.onboardingStatus.completed",
  SKIPPED: "app.api.v1.core.onboarding.enums.onboardingStatus.skipped",
});

// Create DB enum array for Drizzle
export const OnboardingStatusDB = [
  OnboardingStatus.NOT_STARTED,
  OnboardingStatus.IN_PROGRESS,
  OnboardingStatus.COMPLETED,
  OnboardingStatus.SKIPPED,
] as const;

/**
 * Onboarding Step Enum
 * Represents the different steps in the onboarding process
 */
export const {
  enum: OnboardingStep,
  options: OnboardingStepOptions,
  Value: OnboardingStepValue,
} = createEnumOptions({
  QUESTIONS: "app.api.v1.core.onboarding.enums.onboardingStep.questions",
  PRICING: "app.api.v1.core.onboarding.enums.onboardingStep.pricing",
  CONSULTATION: "app.api.v1.core.onboarding.enums.onboardingStep.consultation",
  COMPLETE: "app.api.v1.core.onboarding.enums.onboardingStep.complete",
});

// Create DB enum array for Drizzle
export const OnboardingStepDB = [
  OnboardingStep.QUESTIONS,
  OnboardingStep.PRICING,
  OnboardingStep.CONSULTATION,
  OnboardingStep.COMPLETE,
] as const;

/**
 * Business Type Enum
 * Common business types for onboarding
 */
export const {
  enum: BusinessType,
  options: BusinessTypeOptions,
  Value: BusinessTypeValue,
} = createEnumOptions({
  STARTUP: "app.api.v1.core.onboarding.enums.businessType.startup",
  SMALL_BUSINESS: "app.api.v1.core.onboarding.enums.businessType.smallBusiness",
  MEDIUM_BUSINESS:
    "app.api.v1.core.onboarding.enums.businessType.mediumBusiness",
  ENTERPRISE: "app.api.v1.core.onboarding.enums.businessType.enterprise",
  AGENCY: "app.api.v1.core.onboarding.enums.businessType.agency",
  FREELANCER: "app.api.v1.core.onboarding.enums.businessType.freelancer",
  NON_PROFIT: "app.api.v1.core.onboarding.enums.businessType.nonProfit",
  OTHER: "app.api.v1.core.onboarding.enums.businessType.other",
});

// Create DB enum array for Drizzle
export const BusinessTypeDB = [
  BusinessType.STARTUP,
  BusinessType.SMALL_BUSINESS,
  BusinessType.MEDIUM_BUSINESS,
  BusinessType.ENTERPRISE,
  BusinessType.AGENCY,
  BusinessType.FREELANCER,
  BusinessType.NON_PROFIT,
  BusinessType.OTHER,
] as const;

/**
 * Goal Type Enum
 * Common goals for social media management
 */
export const {
  enum: GoalType,
  options: GoalTypeOptions,
  Value: GoalTypeValue,
} = createEnumOptions({
  BRAND_AWARENESS: "app.api.v1.core.onboarding.enums.goalType.brandAwareness",
  LEAD_GENERATION: "app.api.v1.core.onboarding.enums.goalType.leadGeneration",
  CUSTOMER_ENGAGEMENT:
    "app.api.v1.core.onboarding.enums.goalType.customerEngagement",
  SALES_GROWTH: "app.api.v1.core.onboarding.enums.goalType.salesGrowth",
  CONTENT_CREATION: "app.api.v1.core.onboarding.enums.goalType.contentCreation",
  COMMUNITY_BUILDING:
    "app.api.v1.core.onboarding.enums.goalType.communityBuilding",
  REPUTATION_MANAGEMENT:
    "app.api.v1.core.onboarding.enums.goalType.reputationManagement",
  ANALYTICS_INSIGHTS:
    "app.api.v1.core.onboarding.enums.goalType.analyticsInsights",
});

// Create DB enum array for Drizzle
export const GoalTypeDB = [
  GoalType.BRAND_AWARENESS,
  GoalType.LEAD_GENERATION,
  GoalType.CUSTOMER_ENGAGEMENT,
  GoalType.SALES_GROWTH,
  GoalType.CONTENT_CREATION,
  GoalType.COMMUNITY_BUILDING,
  GoalType.REPUTATION_MANAGEMENT,
  GoalType.ANALYTICS_INSIGHTS,
] as const;

/**
 * Onboarding Completed Steps Constants
 * Used for tracking which steps have been completed
 */
export const {
  enum: OnboardingCompletedStep,
  options: OnboardingCompletedStepOptions,
  Value: OnboardingCompletedStepValue,
} = createEnumOptions({
  BUSINESS_DATA: "app.api.v1.core.onboarding.enums.completedStep.businessData",
  PLAN_SELECTION:
    "app.api.v1.core.onboarding.enums.completedStep.planSelection",
  CONSULTATION: "app.api.v1.core.onboarding.enums.completedStep.consultation",
});

// Create DB enum array for Drizzle
export const OnboardingCompletedStepDB = [
  OnboardingCompletedStep.BUSINESS_DATA,
  OnboardingCompletedStep.PLAN_SELECTION,
  OnboardingCompletedStep.CONSULTATION,
] as const;
