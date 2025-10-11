/**
 * Manifest Enums
 * Defines enums for web app manifest configuration
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Web App Display Mode Enum
 * Defines how the web app should be displayed
 */
export const {
  enum: WebAppDisplayMode,
  options: WebAppDisplayModeOptions,
  Value: WebAppDisplayModeValue,
} = createEnumOptions({
  FULLSCREEN: "app.api.v1.core.manifest.enums.displayMode.fullscreen",
  STANDALONE: "app.api.v1.core.manifest.enums.displayMode.standalone",
  MINIMAL_UI: "app.api.v1.core.manifest.enums.displayMode.minimalUi",
  BROWSER: "app.api.v1.core.manifest.enums.displayMode.browser",
});

/**
 * Web App Orientation Enum
 * Defines the preferred orientation for the web app
 */
export const {
  enum: WebAppOrientation,
  options: WebAppOrientationOptions,
  Value: WebAppOrientationValue,
} = createEnumOptions({
  ANY: "app.api.v1.core.manifest.enums.orientation.any",
  NATURAL: "app.api.v1.core.manifest.enums.orientation.natural",
  LANDSCAPE: "app.api.v1.core.manifest.enums.orientation.landscape",
  LANDSCAPE_PRIMARY:
    "app.api.v1.core.manifest.enums.orientation.landscapePrimary",
  LANDSCAPE_SECONDARY:
    "app.api.v1.core.manifest.enums.orientation.landscapeSecondary",
  PORTRAIT: "app.api.v1.core.manifest.enums.orientation.portrait",
  PORTRAIT_PRIMARY:
    "app.api.v1.core.manifest.enums.orientation.portraitPrimary",
  PORTRAIT_SECONDARY:
    "app.api.v1.core.manifest.enums.orientation.portraitSecondary",
});

/**
 * Web App Category Enum
 * Defines categories for the web app
 */
export const {
  enum: WebAppCategory,
  options: WebAppCategoryOptions,
  Value: WebAppCategoryValue,
} = createEnumOptions({
  BOOKS: "app.api.v1.core.manifest.enums.category.books",
  BUSINESS: "app.api.v1.core.manifest.enums.category.business",
  EDUCATION: "app.api.v1.core.manifest.enums.category.education",
  ENTERTAINMENT: "app.api.v1.core.manifest.enums.category.entertainment",
  FINANCE: "app.api.v1.core.manifest.enums.category.finance",
  FITNESS: "app.api.v1.core.manifest.enums.category.fitness",
  FOOD: "app.api.v1.core.manifest.enums.category.food",
  GAMES: "app.api.v1.core.manifest.enums.category.games",
  GOVERNMENT: "app.api.v1.core.manifest.enums.category.government",
  HEALTH: "app.api.v1.core.manifest.enums.category.health",
  KIDS: "app.api.v1.core.manifest.enums.category.kids",
  LIFESTYLE: "app.api.v1.core.manifest.enums.category.lifestyle",
  MAGAZINES: "app.api.v1.core.manifest.enums.category.magazines",
  MEDICAL: "app.api.v1.core.manifest.enums.category.medical",
  MUSIC: "app.api.v1.core.manifest.enums.category.music",
  NAVIGATION: "app.api.v1.core.manifest.enums.category.navigation",
  NEWS: "app.api.v1.core.manifest.enums.category.news",
  PERSONALIZATION: "app.api.v1.core.manifest.enums.category.personalization",
  PHOTO: "app.api.v1.core.manifest.enums.category.photo",
  POLITICS: "app.api.v1.core.manifest.enums.category.politics",
  PRODUCTIVITY: "app.api.v1.core.manifest.enums.category.productivity",
  SECURITY: "app.api.v1.core.manifest.enums.category.security",
  SHOPPING: "app.api.v1.core.manifest.enums.category.shopping",
  SOCIAL: "app.api.v1.core.manifest.enums.category.social",
  SPORTS: "app.api.v1.core.manifest.enums.category.sports",
  TRAVEL: "app.api.v1.core.manifest.enums.category.travel",
  UTILITIES: "app.api.v1.core.manifest.enums.category.utilities",
  WEATHER: "app.api.v1.core.manifest.enums.category.weather",
});

/**
 * Icon Purpose Enum
 * Defines the purpose of manifest icons
 */
export const {
  enum: IconPurpose,
  options: IconPurposeOptions,
  Value: IconPurposeValue,
} = createEnumOptions({
  MASKABLE: "app.api.v1.core.manifest.enums.iconPurpose.maskable",
  ANY: "app.api.v1.core.manifest.enums.iconPurpose.any",
  MONOCHROME: "app.api.v1.core.manifest.enums.iconPurpose.monochrome",
  MASKABLE_ANY: "app.api.v1.core.manifest.enums.iconPurpose.maskableAny",
});

// DB enum exports for Drizzle (if needed in future)
export const WebAppDisplayModeDB = [
  WebAppDisplayMode.FULLSCREEN,
  WebAppDisplayMode.STANDALONE,
  WebAppDisplayMode.MINIMAL_UI,
  WebAppDisplayMode.BROWSER,
] as const;

export const WebAppOrientationDB = [
  WebAppOrientation.ANY,
  WebAppOrientation.NATURAL,
  WebAppOrientation.LANDSCAPE,
  WebAppOrientation.LANDSCAPE_PRIMARY,
  WebAppOrientation.LANDSCAPE_SECONDARY,
  WebAppOrientation.PORTRAIT,
  WebAppOrientation.PORTRAIT_PRIMARY,
  WebAppOrientation.PORTRAIT_SECONDARY,
] as const;

export const WebAppCategoryDB = [
  WebAppCategory.BOOKS,
  WebAppCategory.BUSINESS,
  WebAppCategory.EDUCATION,
  WebAppCategory.ENTERTAINMENT,
  WebAppCategory.FINANCE,
  WebAppCategory.FITNESS,
  WebAppCategory.FOOD,
  WebAppCategory.GAMES,
  WebAppCategory.GOVERNMENT,
  WebAppCategory.HEALTH,
  WebAppCategory.KIDS,
  WebAppCategory.LIFESTYLE,
  WebAppCategory.MAGAZINES,
  WebAppCategory.MEDICAL,
  WebAppCategory.MUSIC,
  WebAppCategory.NAVIGATION,
  WebAppCategory.NEWS,
  WebAppCategory.PERSONALIZATION,
  WebAppCategory.PHOTO,
  WebAppCategory.POLITICS,
  WebAppCategory.PRODUCTIVITY,
  WebAppCategory.SECURITY,
  WebAppCategory.SHOPPING,
  WebAppCategory.SOCIAL,
  WebAppCategory.SPORTS,
  WebAppCategory.TRAVEL,
  WebAppCategory.UTILITIES,
  WebAppCategory.WEATHER,
] as const;

export const IconPurposeDB = [
  IconPurpose.MASKABLE,
  IconPurpose.ANY,
  IconPurpose.MONOCHROME,
  IconPurpose.MASKABLE_ANY,
] as const;
