/**
 * Enums for Business Info Forms
 * Centralized enums to replace magic strings
 */

// Form Field Categories
export enum FormFieldCategory {
  TECHNOLOGY = "technology",
  SERVICES = "services",
  RETAIL = "retail",
  TRADITIONAL = "traditional",
  HEALTHCARE = "healthcare",
  FINANCE = "finance",
  CREATIVE = "creative",
  EXECUTIVE = "executive",
  MANAGEMENT = "management",
  MARKETING = "marketing",
  TECHNICAL = "technical",
  YOUNG = "young",
  ADULT = "adult",
  MATURE = "mature",
  ALL = "all",
  LIFESTYLE = "lifestyle",
  BUSINESS = "business",
  ENTERTAINMENT = "entertainment",
  TECH = "tech",
  OTHER = "other",
}

// Business Types
export enum BusinessType {
  SAAS = "saas",
  SOFTWARE = "software",
  APP_DEVELOPMENT = "app-development",
  WEB_DEVELOPMENT = "web-development",
  AI_ML = "ai-ml",
  E_COMMERCE = "e-commerce",
  DROPSHIPPING = "dropshipping",
  MARKETPLACE = "marketplace",
  RETAIL = "retail",
  CONSULTING = "consulting",
  AGENCY = "agency",
  FREELANCER = "freelancer",
  COACHING = "coaching",
  MARKETING_AGENCY = "marketing-agency",
  RESTAURANT = "restaurant",
  HEALTHCARE = "healthcare",
  EDUCATION = "education",
  REAL_ESTATE = "real-estate",
  MANUFACTURING = "manufacturing",
  NON_PROFIT = "non-profit",
  STARTUP = "startup",
  OTHER = "other",
}

// Industries
export enum Industry {
  SOFTWARE = "software",
  FINTECH = "fintech",
  EDTECH = "edtech",
  HEALTHTECH = "healthtech",
  CYBERSECURITY = "cybersecurity",
  HEALTHCARE = "healthcare",
  TELEMEDICINE = "telemedicine",
  PHARMACEUTICALS = "pharmaceuticals",
  MEDICAL_DEVICES = "medical-devices",
  BANKING = "banking",
  INSURANCE = "insurance",
  INVESTMENT = "investment",
  CRYPTOCURRENCY = "cryptocurrency",
  FASHION = "fashion",
  BEAUTY = "beauty",
  HOME_GARDEN = "home-garden",
  ELECTRONICS = "electronics",
  FOOD_BEVERAGE = "food-beverage",
  LEGAL = "legal",
  ACCOUNTING = "accounting",
  MARKETING = "marketing",
  HR_RECRUITING = "hr-recruiting",
  REAL_ESTATE = "real-estate",
  DESIGN = "design",
  PHOTOGRAPHY = "photography",
  VIDEO_PRODUCTION = "video-production",
  CONTENT_CREATION = "content-creation",
  ENTERTAINMENT = "entertainment",
  EDUCATION = "education",
  NON_PROFIT = "non-profit",
  GOVERNMENT = "government",
  OTHER = "other",
}

// Job Titles
export enum JobTitle {
  CEO = "ceo",
  CTO = "cto",
  CFO = "cfo",
  CMO = "cmo",
  FOUNDER = "founder",
  CO_FOUNDER = "co-founder",
  GENERAL_MANAGER = "general-manager",
  OPERATIONS_MANAGER = "operations-manager",
  PROJECT_MANAGER = "project-manager",
  PRODUCT_MANAGER = "product-manager",
  MARKETING_MANAGER = "marketing-manager",
  SALES_MANAGER = "sales-manager",
  DIGITAL_MARKETER = "digital-marketer",
  SOCIAL_MEDIA_MANAGER = "social-media-manager",
  DEVELOPER = "developer",
  DESIGNER = "designer",
  DATA_ANALYST = "data-analyst",
  CONSULTANT = "consultant",
  FREELANCER = "freelancer",
  ENTREPRENEUR = "entrepreneur",
  OTHER = "other",
}

// Age Ranges
export enum AgeRange {
  TEENS = "13-17",
  YOUNG_ADULTS = "18-24",
  MILLENNIALS = "25-34",
  GEN_X = "35-44",
  MIDDLE_AGED = "45-54",
  BABY_BOOMERS = "55-64",
  SENIORS = "65+",
  ALL = "all",
}

// Interests
export enum Interest {
  TECHNOLOGY = "technology",
  GAMING = "gaming",
  GADGETS = "gadgets",
  FITNESS = "fitness",
  HEALTH = "health",
  TRAVEL = "travel",
  FOOD = "food",
  FASHION = "fashion",
  BEAUTY = "beauty",
  ENTREPRENEURSHIP = "entrepreneurship",
  INVESTING = "investing",
  MARKETING = "marketing",
  MUSIC = "music",
  MOVIES = "movies",
  SPORTS = "sports",
  BOOKS = "books",
  ART = "art",
  PHOTOGRAPHY = "photography",
  DESIGN = "design",
}

// UI Component States
export enum ComponentState {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
  IDLE = "idle",
}

// Form Field Types
export enum FormFieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SWITCH = "switch",
  DATE = "date",
  AUTOCOMPLETE = "autocomplete",
  TAGS = "tags",
  PHONE = "phone",
  COLOR = "color",
  SLIDER = "slider",
  MULTISELECT = "multiselect",
  LOCATION = "location",
  YEAR = "year",
}

// Translation Keys for Categories
export const CATEGORY_TRANSLATION_KEYS = {
  [FormFieldCategory.TECHNOLOGY]: "common.categories.technology" as const,
  [FormFieldCategory.SERVICES]: "common.categories.services" as const,
  [FormFieldCategory.RETAIL]: "common.categories.retail" as const,
  [FormFieldCategory.TRADITIONAL]: "common.categories.traditional" as const,
  [FormFieldCategory.HEALTHCARE]: "common.categories.healthcare" as const,
  [FormFieldCategory.FINANCE]: "common.categories.finance" as const,
  [FormFieldCategory.CREATIVE]: "common.categories.creative" as const,
  [FormFieldCategory.EXECUTIVE]: "common.categories.executive" as const,
  [FormFieldCategory.MANAGEMENT]: "common.categories.management" as const,
  [FormFieldCategory.MARKETING]: "common.categories.marketing" as const,
  [FormFieldCategory.TECHNICAL]: "common.categories.technical" as const,
  [FormFieldCategory.YOUNG]: "common.categories.young" as const,
  [FormFieldCategory.ADULT]: "common.categories.adult" as const,
  [FormFieldCategory.MATURE]: "common.categories.mature" as const,
  [FormFieldCategory.ALL]: "common.categories.all" as const,
  [FormFieldCategory.LIFESTYLE]: "common.categories.lifestyle" as const,
  [FormFieldCategory.BUSINESS]: "common.categories.business" as const,
  [FormFieldCategory.ENTERTAINMENT]: "common.categories.entertainment" as const,
  [FormFieldCategory.TECH]: "common.categories.tech" as const,
  [FormFieldCategory.OTHER]: "common.categories.other" as const,
} as const;
