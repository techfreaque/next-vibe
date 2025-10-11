/**
 * Business Info Enums with Translation Options
 * Enum definitions for business information data with translation patterns
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Business size categories
 */
export const {
  enum: BusinessSize,
  options: BusinessSizeOptions,
  Value: BusinessSizeValue,
} = createEnumOptions({
  STARTUP:
    "app.api.v1.core.businessData.businessInfo.enums.businessSize.STARTUP",
  SMALL: "app.api.v1.core.businessData.businessInfo.enums.businessSize.SMALL",
  MEDIUM: "app.api.v1.core.businessData.businessInfo.enums.businessSize.MEDIUM",
  LARGE: "app.api.v1.core.businessData.businessInfo.enums.businessSize.LARGE",
  ENTERPRISE:
    "app.api.v1.core.businessData.businessInfo.enums.businessSize.ENTERPRISE",
});

/**
 * Business type categories
 */
export const {
  enum: BusinessType,
  options: BusinessTypeOptions,
  Value: BusinessTypeValue,
} = createEnumOptions({
  STARTUP:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.STARTUP",
  SMALL_BUSINESS:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.SMALL_BUSINESS",
  CORPORATION:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.CORPORATION",
  LLC: "app.api.v1.core.businessData.businessInfo.enums.businessType.LLC",
  PARTNERSHIP:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.PARTNERSHIP",
  SOLE_PROPRIETORSHIP:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.SOLE_PROPRIETORSHIP",
  NON_PROFIT:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.NON_PROFIT",
  FREELANCER:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.FREELANCER",
  CONSULTING:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.CONSULTING",
  AGENCY: "app.api.v1.core.businessData.businessInfo.enums.businessType.AGENCY",
  E_COMMERCE:
    "app.api.v1.core.businessData.businessInfo.enums.businessType.E_COMMERCE",
  SaaS: "app.api.v1.core.businessData.businessInfo.enums.businessType.SaaS",
  OTHER: "app.api.v1.core.businessData.businessInfo.enums.businessType.OTHER",
});

/**
 * Industry categories
 */
export const {
  enum: Industry,
  options: IndustryOptions,
  Value: IndustryValue,
} = createEnumOptions({
  TECHNOLOGY:
    "app.api.v1.core.businessData.businessInfo.enums.industry.TECHNOLOGY",
  HEALTHCARE:
    "app.api.v1.core.businessData.businessInfo.enums.industry.HEALTHCARE",
  FINANCE: "app.api.v1.core.businessData.businessInfo.enums.industry.FINANCE",
  RETAIL: "app.api.v1.core.businessData.businessInfo.enums.industry.RETAIL",
  EDUCATION:
    "app.api.v1.core.businessData.businessInfo.enums.industry.EDUCATION",
  MANUFACTURING:
    "app.api.v1.core.businessData.businessInfo.enums.industry.MANUFACTURING",
  REAL_ESTATE:
    "app.api.v1.core.businessData.businessInfo.enums.industry.REAL_ESTATE",
  FOOD_BEVERAGE:
    "app.api.v1.core.businessData.businessInfo.enums.industry.FOOD_BEVERAGE",
  TRAVEL_HOSPITALITY:
    "app.api.v1.core.businessData.businessInfo.enums.industry.TRAVEL_HOSPITALITY",
  ENTERTAINMENT:
    "app.api.v1.core.businessData.businessInfo.enums.industry.ENTERTAINMENT",
  AUTOMOTIVE:
    "app.api.v1.core.businessData.businessInfo.enums.industry.AUTOMOTIVE",
  CONSTRUCTION:
    "app.api.v1.core.businessData.businessInfo.enums.industry.CONSTRUCTION",
  CONSULTING:
    "app.api.v1.core.businessData.businessInfo.enums.industry.CONSULTING",
  MARKETING_ADVERTISING:
    "app.api.v1.core.businessData.businessInfo.enums.industry.MARKETING_ADVERTISING",
  LEGAL: "app.api.v1.core.businessData.businessInfo.enums.industry.LEGAL",
  FITNESS_WELLNESS:
    "app.api.v1.core.businessData.businessInfo.enums.industry.FITNESS_WELLNESS",
  BEAUTY_FASHION:
    "app.api.v1.core.businessData.businessInfo.enums.industry.BEAUTY_FASHION",
  HOME_GARDEN:
    "app.api.v1.core.businessData.businessInfo.enums.industry.HOME_GARDEN",
  SPORTS_RECREATION:
    "app.api.v1.core.businessData.businessInfo.enums.industry.SPORTS_RECREATION",
  NON_PROFIT:
    "app.api.v1.core.businessData.businessInfo.enums.industry.NON_PROFIT",
  GOVERNMENT:
    "app.api.v1.core.businessData.businessInfo.enums.industry.GOVERNMENT",
  OTHER: "app.api.v1.core.businessData.businessInfo.enums.industry.OTHER",
});

// Create DB arrays for database schema
export const BusinessSizeDB = [
  BusinessSize.STARTUP,
  BusinessSize.SMALL,
  BusinessSize.MEDIUM,
  BusinessSize.LARGE,
  BusinessSize.ENTERPRISE,
] as const;

export const BusinessTypeDB = [
  BusinessType.STARTUP,
  BusinessType.SMALL_BUSINESS,
  BusinessType.CORPORATION,
  BusinessType.LLC,
  BusinessType.PARTNERSHIP,
  BusinessType.SOLE_PROPRIETORSHIP,
  BusinessType.NON_PROFIT,
  BusinessType.FREELANCER,
  BusinessType.CONSULTING,
  BusinessType.AGENCY,
  BusinessType.E_COMMERCE,
  BusinessType.SaaS,
  BusinessType.OTHER,
] as const;

export const IndustryDB = [
  Industry.TECHNOLOGY,
  Industry.HEALTHCARE,
  Industry.FINANCE,
  Industry.RETAIL,
  Industry.EDUCATION,
  Industry.MANUFACTURING,
  Industry.REAL_ESTATE,
  Industry.FOOD_BEVERAGE,
  Industry.TRAVEL_HOSPITALITY,
  Industry.ENTERTAINMENT,
  Industry.AUTOMOTIVE,
  Industry.CONSTRUCTION,
  Industry.CONSULTING,
  Industry.MARKETING_ADVERTISING,
  Industry.LEGAL,
  Industry.FITNESS_WELLNESS,
  Industry.BEAUTY_FASHION,
  Industry.HOME_GARDEN,
  Industry.SPORTS_RECREATION,
  Industry.NON_PROFIT,
  Industry.GOVERNMENT,
  Industry.OTHER,
] as const;
