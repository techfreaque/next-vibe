/**
 * Profile Enums with Translation Options
 * Enum definitions for profile data with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Job title categories
 */
export const {
  enum: JobTitleCategory,
  options: JobTitleCategoryOptions,
  Value: JobTitleCategoryValue,
} = createEnumOptions({
  EXECUTIVE:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.executive",
  MANAGEMENT:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.management",
  MARKETING:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.marketing",
  SALES: "app.api.v1.core.businessData.profile.enums.jobTitleCategory.sales",
  OPERATIONS:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.operations",
  TECHNOLOGY:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.technology",
  FINANCE:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.finance",
  HUMAN_RESOURCES:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.humanResources",
  CUSTOMER_SERVICE:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.customerService",
  PRODUCT:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.product",
  DESIGN: "app.api.v1.core.businessData.profile.enums.jobTitleCategory.design",
  CONSULTING:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.consulting",
  FREELANCER:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.freelancer",
  ENTREPRENEUR:
    "app.api.v1.core.businessData.profile.enums.jobTitleCategory.entrepreneur",
  OTHER: "app.api.v1.core.businessData.profile.enums.jobTitleCategory.other",
});

/**
 * Company size categories
 */
export const {
  enum: CompanySize,
  options: CompanySizeOptions,
  Value: CompanySizeValue,
} = createEnumOptions({
  SOLO: "app.api.v1.core.businessData.profile.enums.companySize.solo",
  SMALL: "app.api.v1.core.businessData.profile.enums.companySize.small", // 2-10 employees
  MEDIUM: "app.api.v1.core.businessData.profile.enums.companySize.medium", // 11-50 employees
  LARGE: "app.api.v1.core.businessData.profile.enums.companySize.large", // 51-200 employees
  ENTERPRISE:
    "app.api.v1.core.businessData.profile.enums.companySize.enterprise", // 200+ employees
});

/**
 * Experience levels
 */
export const {
  enum: ExperienceLevel,
  options: ExperienceLevelOptions,
  Value: ExperienceLevelValue,
} = createEnumOptions({
  ENTRY: "app.api.v1.core.businessData.profile.enums.experienceLevel.entry", // 0-2 years
  JUNIOR: "app.api.v1.core.businessData.profile.enums.experienceLevel.junior", // 2-5 years
  MID: "app.api.v1.core.businessData.profile.enums.experienceLevel.mid", // 5-10 years
  SENIOR: "app.api.v1.core.businessData.profile.enums.experienceLevel.senior", // 10-15 years
  EXPERT: "app.api.v1.core.businessData.profile.enums.experienceLevel.expert", // 15+ years
});

// Create DB arrays for database schema
export const JobTitleCategoryDB = [
  JobTitleCategory.EXECUTIVE,
  JobTitleCategory.MANAGEMENT,
  JobTitleCategory.MARKETING,
  JobTitleCategory.SALES,
  JobTitleCategory.OPERATIONS,
  JobTitleCategory.TECHNOLOGY,
  JobTitleCategory.FINANCE,
  JobTitleCategory.HUMAN_RESOURCES,
  JobTitleCategory.CUSTOMER_SERVICE,
  JobTitleCategory.PRODUCT,
  JobTitleCategory.DESIGN,
  JobTitleCategory.CONSULTING,
  JobTitleCategory.FREELANCER,
  JobTitleCategory.ENTREPRENEUR,
  JobTitleCategory.OTHER,
] as const;

export const CompanySizeDB = [
  CompanySize.SOLO,
  CompanySize.SMALL,
  CompanySize.MEDIUM,
  CompanySize.LARGE,
  CompanySize.ENTERPRISE,
] as const;

export const ExperienceLevelDB = [
  ExperienceLevel.ENTRY,
  ExperienceLevel.JUNIOR,
  ExperienceLevel.MID,
  ExperienceLevel.SENIOR,
  ExperienceLevel.EXPERT,
] as const;
