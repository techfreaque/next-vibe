/**
 * Form Options Constants
 * Predefined options for enhanced UX in business info forms
 */

import type { MetricTypeValues } from "@/app/api/[locale]/v1/core/business-data/goals/enum";
import { MetricType } from "@/app/api/[locale]/v1/core/business-data/goals/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  AgeRange,
  BusinessType,
  FormFieldCategory,
  Industry,
  Interest,
  JobTitle,
} from "./enums";

// Business Types with categories for better organization
export const BUSINESS_TYPES: readonly {
  value: BusinessType;
  label: TranslationKey;
  category: FormFieldCategory;
}[] = [
  // Technology
  {
    value: BusinessType.SAAS,
    label: "businessInfo.businessTypes.saas",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: BusinessType.SOFTWARE,
    label: "businessInfo.businessTypes.software",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: BusinessType.APP_DEVELOPMENT,
    label: "businessInfo.businessTypes.appDevelopment",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: BusinessType.WEB_DEVELOPMENT,
    label: "businessInfo.businessTypes.webDevelopment",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: BusinessType.AI_ML,
    label: "businessInfo.businessTypes.aiMl",
    category: FormFieldCategory.TECHNOLOGY,
  },

  // E-commerce & Retail
  {
    value: BusinessType.E_COMMERCE,
    label: "businessInfo.businessTypes.eCommerce",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: BusinessType.DROPSHIPPING,
    label: "businessInfo.businessTypes.dropshipping",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: BusinessType.MARKETPLACE,
    label: "businessInfo.businessTypes.marketplace",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: BusinessType.RETAIL,
    label: "businessInfo.businessTypes.retail",
    category: FormFieldCategory.RETAIL,
  },

  // Services
  {
    value: BusinessType.CONSULTING,
    label: "businessInfo.businessTypes.consulting",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: BusinessType.AGENCY,
    label: "businessInfo.businessTypes.agency",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: BusinessType.FREELANCER,
    label: "businessInfo.businessTypes.freelancer",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: BusinessType.COACHING,
    label: "businessInfo.businessTypes.coaching",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: BusinessType.MARKETING_AGENCY,
    label: "businessInfo.businessTypes.marketingAgency",
    category: FormFieldCategory.SERVICES,
  },

  // Traditional Business
  {
    value: BusinessType.RESTAURANT,
    label: "businessInfo.businessTypes.restaurant",
    category: FormFieldCategory.TRADITIONAL,
  },
  {
    value: BusinessType.HEALTHCARE,
    label: "businessInfo.businessTypes.healthcare",
    category: FormFieldCategory.TRADITIONAL,
  },
  {
    value: BusinessType.EDUCATION,
    label: "businessInfo.businessTypes.education",
    category: FormFieldCategory.TRADITIONAL,
  },
  {
    value: BusinessType.REAL_ESTATE,
    label: "businessInfo.businessTypes.realEstate",
    category: FormFieldCategory.TRADITIONAL,
  },
  {
    value: BusinessType.MANUFACTURING,
    label: "businessInfo.businessTypes.manufacturing",
    category: FormFieldCategory.TRADITIONAL,
  },

  // Other
  {
    value: BusinessType.NON_PROFIT,
    label: "businessInfo.businessTypes.nonProfit",
    category: FormFieldCategory.OTHER,
  },
  {
    value: BusinessType.STARTUP,
    label: "businessInfo.businessTypes.startup",
    category: FormFieldCategory.OTHER,
  },
  {
    value: BusinessType.OTHER,
    label: "businessInfo.businessTypes.other",
    category: FormFieldCategory.OTHER,
  },
];

// Industries with detailed subcategories
export const INDUSTRIES: readonly {
  value: Industry;
  label: TranslationKey;
  category: FormFieldCategory;
}[] = [
  // Technology
  {
    value: Industry.SOFTWARE,
    label: "businessInfo.industries.software",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: Industry.FINTECH,
    label: "businessInfo.industries.fintech",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: Industry.EDTECH,
    label: "businessInfo.industries.edtech",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: Industry.HEALTHTECH,
    label: "businessInfo.industries.healthtech",
    category: FormFieldCategory.TECHNOLOGY,
  },
  {
    value: Industry.CYBERSECURITY,
    label: "businessInfo.industries.cybersecurity",
    category: FormFieldCategory.TECHNOLOGY,
  },

  // Healthcare
  {
    value: Industry.HEALTHCARE,
    label: "businessInfo.industries.healthcare",
    category: FormFieldCategory.HEALTHCARE,
  },
  {
    value: Industry.TELEMEDICINE,
    label: "businessInfo.industries.telemedicine",
    category: FormFieldCategory.HEALTHCARE,
  },
  {
    value: Industry.PHARMACEUTICALS,
    label: "businessInfo.industries.pharmaceuticals",
    category: FormFieldCategory.HEALTHCARE,
  },
  {
    value: Industry.MEDICAL_DEVICES,
    label: "businessInfo.industries.medicalDevices",
    category: FormFieldCategory.HEALTHCARE,
  },

  // Finance
  {
    value: Industry.BANKING,
    label: "businessInfo.industries.banking",
    category: FormFieldCategory.FINANCE,
  },
  {
    value: Industry.INSURANCE,
    label: "businessInfo.industries.insurance",
    category: FormFieldCategory.FINANCE,
  },
  {
    value: Industry.INVESTMENT,
    label: "businessInfo.industries.investment",
    category: FormFieldCategory.FINANCE,
  },
  {
    value: Industry.CRYPTOCURRENCY,
    label: "businessInfo.industries.cryptocurrency",
    category: FormFieldCategory.FINANCE,
  },

  // Retail & E-commerce
  {
    value: Industry.FASHION,
    label: "businessInfo.industries.fashion",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: Industry.BEAUTY,
    label: "businessInfo.industries.beauty",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: Industry.HOME_GARDEN,
    label: "businessInfo.industries.homeGarden",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: Industry.ELECTRONICS,
    label: "businessInfo.industries.electronics",
    category: FormFieldCategory.RETAIL,
  },
  {
    value: Industry.FOOD_BEVERAGE,
    label: "businessInfo.industries.foodBeverage",
    category: FormFieldCategory.RETAIL,
  },

  // Professional Services
  {
    value: Industry.LEGAL,
    label: "businessInfo.industries.legal",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: Industry.ACCOUNTING,
    label: "businessInfo.industries.accounting",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: Industry.MARKETING,
    label: "businessInfo.industries.marketing",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: Industry.HR_RECRUITING,
    label: "businessInfo.industries.hrRecruiting",
    category: FormFieldCategory.SERVICES,
  },
  {
    value: Industry.REAL_ESTATE,
    label: "businessInfo.industries.realEstate",
    category: FormFieldCategory.SERVICES,
  },

  // Creative & Media
  {
    value: Industry.DESIGN,
    label: "businessInfo.industries.design",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Industry.PHOTOGRAPHY,
    label: "businessInfo.industries.photography",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Industry.VIDEO_PRODUCTION,
    label: "businessInfo.industries.videoProduction",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Industry.CONTENT_CREATION,
    label: "businessInfo.industries.contentCreation",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Industry.ENTERTAINMENT,
    label: "businessInfo.industries.entertainment",
    category: FormFieldCategory.CREATIVE,
  },

  // Other
  {
    value: Industry.EDUCATION,
    label: "businessInfo.industries.education",
    category: FormFieldCategory.OTHER,
  },
  {
    value: Industry.NON_PROFIT,
    label: "businessInfo.industries.nonProfit",
    category: FormFieldCategory.OTHER,
  },
  {
    value: Industry.GOVERNMENT,
    label: "businessInfo.industries.government",
    category: FormFieldCategory.OTHER,
  },
  {
    value: Industry.OTHER,
    label: "businessInfo.industries.other",
    category: FormFieldCategory.OTHER,
  },
];

// Common Job Titles for autocomplete
export const JOB_TITLES: readonly {
  value: JobTitle;
  label: TranslationKey;
  category: FormFieldCategory;
}[] = [
  // Executive
  {
    value: JobTitle.CEO,
    label: "businessInfo.jobTitles.ceo",
    category: FormFieldCategory.EXECUTIVE,
  },
  {
    value: JobTitle.CTO,
    label: "businessInfo.jobTitles.cto",
    category: FormFieldCategory.EXECUTIVE,
  },
  {
    value: JobTitle.CFO,
    label: "businessInfo.jobTitles.cfo",
    category: FormFieldCategory.EXECUTIVE,
  },
  {
    value: JobTitle.CMO,
    label: "businessInfo.jobTitles.cmo",
    category: FormFieldCategory.EXECUTIVE,
  },
  {
    value: JobTitle.FOUNDER,
    label: "businessInfo.jobTitles.founder",
    category: FormFieldCategory.EXECUTIVE,
  },
  {
    value: JobTitle.CO_FOUNDER,
    label: "businessInfo.jobTitles.coFounder",
    category: FormFieldCategory.EXECUTIVE,
  },

  // Management
  {
    value: JobTitle.GENERAL_MANAGER,
    label: "businessInfo.jobTitles.generalManager",
    category: FormFieldCategory.MANAGEMENT,
  },
  {
    value: JobTitle.OPERATIONS_MANAGER,
    label: "businessInfo.jobTitles.operationsManager",
    category: FormFieldCategory.MANAGEMENT,
  },
  {
    value: JobTitle.PROJECT_MANAGER,
    label: "businessInfo.jobTitles.projectManager",
    category: FormFieldCategory.MANAGEMENT,
  },
  {
    value: JobTitle.PRODUCT_MANAGER,
    label: "businessInfo.jobTitles.productManager",
    category: FormFieldCategory.MANAGEMENT,
  },

  // Marketing & Sales
  {
    value: JobTitle.MARKETING_MANAGER,
    label: "businessInfo.jobTitles.marketingManager",
    category: FormFieldCategory.MARKETING,
  },
  {
    value: JobTitle.SALES_MANAGER,
    label: "businessInfo.jobTitles.salesManager",
    category: FormFieldCategory.MARKETING,
  },
  {
    value: JobTitle.DIGITAL_MARKETER,
    label: "businessInfo.jobTitles.digitalMarketer",
    category: FormFieldCategory.MARKETING,
  },
  {
    value: JobTitle.SOCIAL_MEDIA_MANAGER,
    label: "businessInfo.jobTitles.socialMediaManager",
    category: FormFieldCategory.MARKETING,
  },

  // Technical
  {
    value: JobTitle.DEVELOPER,
    label: "businessInfo.jobTitles.developer",
    category: FormFieldCategory.TECHNICAL,
  },
  {
    value: JobTitle.DESIGNER,
    label: "businessInfo.jobTitles.designer",
    category: FormFieldCategory.TECHNICAL,
  },
  {
    value: JobTitle.DATA_ANALYST,
    label: "businessInfo.jobTitles.dataAnalyst",
    category: FormFieldCategory.TECHNICAL,
  },

  // Other
  {
    value: JobTitle.CONSULTANT,
    label: "businessInfo.jobTitles.consultant",
    category: FormFieldCategory.OTHER,
  },
  {
    value: JobTitle.FREELANCER,
    label: "businessInfo.jobTitles.freelancer",
    category: FormFieldCategory.OTHER,
  },
  {
    value: JobTitle.ENTREPRENEUR,
    label: "businessInfo.jobTitles.entrepreneur",
    category: FormFieldCategory.OTHER,
  },
  {
    value: JobTitle.OTHER,
    label: "businessInfo.jobTitles.other",
    category: FormFieldCategory.OTHER,
  },
];

// Age Ranges for audience targeting
export const AGE_RANGES: readonly {
  value: AgeRange;
  label: TranslationKey;
  category: FormFieldCategory;
}[] = [
  {
    value: AgeRange.TEENS,
    label: "businessInfo.ageRanges.teens",
    category: FormFieldCategory.YOUNG,
  },
  {
    value: AgeRange.YOUNG_ADULTS,
    label: "businessInfo.ageRanges.youngAdults",
    category: FormFieldCategory.YOUNG,
  },
  {
    value: AgeRange.MILLENNIALS,
    label: "businessInfo.ageRanges.millennials",
    category: FormFieldCategory.ADULT,
  },
  {
    value: AgeRange.GEN_X,
    label: "businessInfo.ageRanges.genX",
    category: FormFieldCategory.ADULT,
  },
  {
    value: AgeRange.MIDDLE_AGED,
    label: "businessInfo.ageRanges.middleAged",
    category: FormFieldCategory.MATURE,
  },
  {
    value: AgeRange.BABY_BOOMERS,
    label: "businessInfo.ageRanges.babyBoomers",
    category: FormFieldCategory.MATURE,
  },
  {
    value: AgeRange.SENIORS,
    label: "businessInfo.ageRanges.seniors",
    category: FormFieldCategory.MATURE,
  },
  {
    value: AgeRange.ALL,
    label: "businessInfo.ageRanges.all",
    category: FormFieldCategory.ALL,
  },
];

// Common interests/hobbies for audience targeting
export const INTERESTS: readonly {
  value: Interest;
  label: TranslationKey;
  category: FormFieldCategory;
}[] = [
  // Technology
  {
    value: Interest.TECHNOLOGY,
    label: "businessInfo.interests.technology",
    category: FormFieldCategory.TECH,
  },
  {
    value: Interest.GAMING,
    label: "businessInfo.interests.gaming",
    category: FormFieldCategory.TECH,
  },
  {
    value: Interest.GADGETS,
    label: "businessInfo.interests.gadgets",
    category: FormFieldCategory.TECH,
  },

  // Lifestyle
  {
    value: Interest.FITNESS,
    label: "businessInfo.interests.fitness",
    category: FormFieldCategory.LIFESTYLE,
  },
  {
    value: Interest.HEALTH,
    label: "businessInfo.interests.health",
    category: FormFieldCategory.LIFESTYLE,
  },
  {
    value: Interest.TRAVEL,
    label: "businessInfo.interests.travel",
    category: FormFieldCategory.LIFESTYLE,
  },
  {
    value: Interest.FOOD,
    label: "businessInfo.interests.food",
    category: FormFieldCategory.LIFESTYLE,
  },
  {
    value: Interest.FASHION,
    label: "businessInfo.interests.fashion",
    category: FormFieldCategory.LIFESTYLE,
  },
  {
    value: Interest.BEAUTY,
    label: "businessInfo.interests.beauty",
    category: FormFieldCategory.LIFESTYLE,
  },

  // Business
  {
    value: Interest.ENTREPRENEURSHIP,
    label: "businessInfo.interests.entrepreneurship",
    category: FormFieldCategory.BUSINESS,
  },
  {
    value: Interest.INVESTING,
    label: "businessInfo.interests.investing",
    category: FormFieldCategory.BUSINESS,
  },
  {
    value: Interest.MARKETING,
    label: "businessInfo.interests.marketing",
    category: FormFieldCategory.BUSINESS,
  },

  // Entertainment
  {
    value: Interest.MUSIC,
    label: "businessInfo.interests.music",
    category: FormFieldCategory.ENTERTAINMENT,
  },
  {
    value: Interest.MOVIES,
    label: "businessInfo.interests.movies",
    category: FormFieldCategory.ENTERTAINMENT,
  },
  {
    value: Interest.SPORTS,
    label: "businessInfo.interests.sports",
    category: FormFieldCategory.ENTERTAINMENT,
  },
  {
    value: Interest.BOOKS,
    label: "businessInfo.interests.books",
    category: FormFieldCategory.ENTERTAINMENT,
  },

  // Creative
  {
    value: Interest.ART,
    label: "businessInfo.interests.art",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Interest.PHOTOGRAPHY,
    label: "businessInfo.interests.photography",
    category: FormFieldCategory.CREATIVE,
  },
  {
    value: Interest.DESIGN,
    label: "businessInfo.interests.design",
    category: FormFieldCategory.CREATIVE,
  },
];

// Budget ranges for goals
export const BUDGET_RANGES: readonly {
  value: string;
  label: TranslationKey;
  min: number;
  max: number | null;
}[] = [
  {
    value: "0-1000",
    label: "businessInfo.budgetRanges.starter",
    min: 0,
    max: 1000,
  },
  {
    value: "1000-5000",
    label: "businessInfo.budgetRanges.small",
    min: 1000,
    max: 5000,
  },
  {
    value: "5000-15000",
    label: "businessInfo.budgetRanges.medium",
    min: 5000,
    max: 15000,
  },
  {
    value: "15000-50000",
    label: "businessInfo.budgetRanges.large",
    min: 15000,
    max: 50000,
  },
  {
    value: "50000+",
    label: "businessInfo.budgetRanges.enterprise",
    min: 50000,
    max: null,
  },
];

// Common brand colors
export const BRAND_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
];

// Success metrics for goals
export const SUCCESS_METRICS: readonly {
  value: typeof MetricTypeValues;
  label: TranslationKey;
  category: TranslationKey;
}[] = [
  {
    value: MetricType.REVENUE,
    label: "businessInfo.successMetrics.revenue",
    category: "common.categories.finance",
  },
  {
    value: MetricType.CUSTOMERS,
    label: "businessInfo.successMetrics.customers",
    category: "common.categories.business",
  },
  {
    value: MetricType.TRAFFIC,
    label: "businessInfo.successMetrics.traffic",
    category: "common.categories.business",
  },
  {
    value: MetricType.CONVERSIONS,
    label: "businessInfo.successMetrics.conversions",
    category: "common.categories.business",
  },
  {
    value: MetricType.BRAND_AWARENESS,
    label: "businessInfo.successMetrics.brandAwareness",
    category: "common.categories.marketing",
  },
  {
    value: MetricType.ENGAGEMENT,
    label: "businessInfo.successMetrics.engagement",
    category: "common.categories.marketing",
  },
  {
    value: MetricType.RETENTION,
    label: "businessInfo.successMetrics.retention",
    category: "common.categories.business",
  },
  {
    value: MetricType.SATISFACTION,
    label: "businessInfo.successMetrics.satisfaction",
    category: "common.categories.business",
  },
];
