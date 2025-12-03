/**
 * Manifest Enums
 * Defines enums for web app manifest configuration
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Web App Display Mode Enum
 * Defines how the web app should be displayed
 */
export const {
  enum: WebAppDisplayMode,
  options: WebAppDisplayModeOptions,
  Value: WebAppDisplayModeValue,
} = createEnumOptions({
  FULLSCREEN: "app.api.manifest.enums.displayMode.fullscreen",
  STANDALONE: "app.api.manifest.enums.displayMode.standalone",
  MINIMAL_UI: "app.api.manifest.enums.displayMode.minimalUi",
  BROWSER: "app.api.manifest.enums.displayMode.browser",
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
  ANY: "app.api.manifest.enums.orientation.any",
  NATURAL: "app.api.manifest.enums.orientation.natural",
  LANDSCAPE: "app.api.manifest.enums.orientation.landscape",
  LANDSCAPE_PRIMARY: "app.api.manifest.enums.orientation.landscapePrimary",
  LANDSCAPE_SECONDARY: "app.api.manifest.enums.orientation.landscapeSecondary",
  PORTRAIT: "app.api.manifest.enums.orientation.portrait",
  PORTRAIT_PRIMARY: "app.api.manifest.enums.orientation.portraitPrimary",
  PORTRAIT_SECONDARY: "app.api.manifest.enums.orientation.portraitSecondary",
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
  BOOKS: "app.api.manifest.enums.category.books",
  BUSINESS: "app.api.manifest.enums.category.business",
  EDUCATION: "app.api.manifest.enums.category.education",
  ENTERTAINMENT: "app.api.manifest.enums.category.entertainment",
  FINANCE: "app.api.manifest.enums.category.finance",
  FITNESS: "app.api.manifest.enums.category.fitness",
  FOOD: "app.api.manifest.enums.category.food",
  GAMES: "app.api.manifest.enums.category.games",
  GOVERNMENT: "app.api.manifest.enums.category.government",
  HEALTH: "app.api.manifest.enums.category.health",
  KIDS: "app.api.manifest.enums.category.kids",
  LIFESTYLE: "app.api.manifest.enums.category.lifestyle",
  MAGAZINES: "app.api.manifest.enums.category.magazines",
  MEDICAL: "app.api.manifest.enums.category.medical",
  MUSIC: "app.api.manifest.enums.category.music",
  NAVIGATION: "app.api.manifest.enums.category.navigation",
  NEWS: "app.api.manifest.enums.category.news",
  PERSONALIZATION: "app.api.manifest.enums.category.personalization",
  PHOTO: "app.api.manifest.enums.category.photo",
  POLITICS: "app.api.manifest.enums.category.politics",
  PRODUCTIVITY: "app.api.manifest.enums.category.productivity",
  SECURITY: "app.api.manifest.enums.category.security",
  SHOPPING: "app.api.manifest.enums.category.shopping",
  SOCIAL: "app.api.manifest.enums.category.social",
  SPORTS: "app.api.manifest.enums.category.sports",
  TRAVEL: "app.api.manifest.enums.category.travel",
  UTILITIES: "app.api.manifest.enums.category.utilities",
  WEATHER: "app.api.manifest.enums.category.weather",
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
  MASKABLE: "app.api.manifest.enums.iconPurpose.maskable",
  ANY: "app.api.manifest.enums.iconPurpose.any",
  MONOCHROME: "app.api.manifest.enums.iconPurpose.monochrome",
  MASKABLE_ANY: "app.api.manifest.enums.iconPurpose.maskableAny",
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
