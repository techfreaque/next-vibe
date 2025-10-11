/**
 * Challenges Enums with Translation Options
 * Enum definitions for business challenges data
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Challenge categories
 */
export const {
  enum: ChallengeCategory,
  options: ChallengeCategoryOptions,
  Value: ChallengeCategoryValue,
} = createEnumOptions({
  MARKETING:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.marketing",
  OPERATIONS:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.operations",
  FINANCIAL:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.financial",
  TECHNICAL:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.technical",
  HUMAN_RESOURCES:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.humanResources",
  CUSTOMER_SERVICE:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.customerService",
  PRODUCT_DEVELOPMENT:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.productDevelopment",
  SALES:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.sales",
  STRATEGY:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.strategy",
  COMPLIANCE:
    "app.api.v1.core.businessData.challenges.enums.challengeCategory.compliance",
});

/**
 * Challenge severity levels
 */
export const {
  enum: ChallengeSeverity,
  options: ChallengeSeverityOptions,
  Value: ChallengeSeverityValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.businessData.challenges.enums.challengeSeverity.low",
  MEDIUM:
    "app.api.v1.core.businessData.challenges.enums.challengeSeverity.medium",
  HIGH: "app.api.v1.core.businessData.challenges.enums.challengeSeverity.high",
  CRITICAL:
    "app.api.v1.core.businessData.challenges.enums.challengeSeverity.critical",
});

/**
 * Resource constraint types
 */
export const {
  enum: ResourceConstraint,
  options: ResourceConstraintOptions,
  Value: ResourceConstraintValue,
} = createEnumOptions({
  BUDGET:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.budget",
  TIME: "app.api.v1.core.businessData.challenges.enums.resourceConstraint.time",
  STAFF:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.staff",
  SKILLS:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.skills",
  TECHNOLOGY:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.technology",
  EQUIPMENT:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.equipment",
  SPACE:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.space",
  KNOWLEDGE:
    "app.api.v1.core.businessData.challenges.enums.resourceConstraint.knowledge",
});

/**
 * Support needed areas
 */
export const {
  enum: SupportArea,
  options: SupportAreaOptions,
  Value: SupportAreaValue,
} = createEnumOptions({
  STRATEGY:
    "app.api.v1.core.businessData.challenges.enums.supportArea.strategy",
  MARKETING:
    "app.api.v1.core.businessData.challenges.enums.supportArea.marketing",
  TECHNOLOGY:
    "app.api.v1.core.businessData.challenges.enums.supportArea.technology",
  OPERATIONS:
    "app.api.v1.core.businessData.challenges.enums.supportArea.operations",
  FINANCE: "app.api.v1.core.businessData.challenges.enums.supportArea.finance",
  HUMAN_RESOURCES:
    "app.api.v1.core.businessData.challenges.enums.supportArea.humanResources",
  LEGAL: "app.api.v1.core.businessData.challenges.enums.supportArea.legal",
  TRAINING:
    "app.api.v1.core.businessData.challenges.enums.supportArea.training",
  CONSULTING:
    "app.api.v1.core.businessData.challenges.enums.supportArea.consulting",
  IMPLEMENTATION:
    "app.api.v1.core.businessData.challenges.enums.supportArea.implementation",
});

// Create DB arrays for database schema
export const ChallengeCategoryDB = [
  ChallengeCategory.MARKETING,
  ChallengeCategory.OPERATIONS,
  ChallengeCategory.FINANCIAL,
  ChallengeCategory.TECHNICAL,
  ChallengeCategory.HUMAN_RESOURCES,
  ChallengeCategory.CUSTOMER_SERVICE,
  ChallengeCategory.PRODUCT_DEVELOPMENT,
  ChallengeCategory.SALES,
  ChallengeCategory.STRATEGY,
  ChallengeCategory.COMPLIANCE,
] as const;

export const ChallengeSeverityDB = [
  ChallengeSeverity.LOW,
  ChallengeSeverity.MEDIUM,
  ChallengeSeverity.HIGH,
  ChallengeSeverity.CRITICAL,
] as const;

export const ResourceConstraintDB = [
  ResourceConstraint.BUDGET,
  ResourceConstraint.TIME,
  ResourceConstraint.STAFF,
  ResourceConstraint.SKILLS,
  ResourceConstraint.TECHNOLOGY,
  ResourceConstraint.EQUIPMENT,
  ResourceConstraint.SPACE,
  ResourceConstraint.KNOWLEDGE,
] as const;

export const SupportAreaDB = [
  SupportArea.STRATEGY,
  SupportArea.MARKETING,
  SupportArea.TECHNOLOGY,
  SupportArea.OPERATIONS,
  SupportArea.FINANCE,
  SupportArea.HUMAN_RESOURCES,
  SupportArea.LEGAL,
  SupportArea.TRAINING,
  SupportArea.CONSULTING,
  SupportArea.IMPLEMENTATION,
] as const;
